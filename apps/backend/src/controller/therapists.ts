import {
   AddTherapistSchema,
   AddressHavingID,
   CallTime,
   CalltimeHavingID,
   Therapist,
   TherapistHavingID,
   TherapistSchema,
   TherapistSearch,
   TherapistSearchSchema,
} from '@buddy/base-utils'
import { Address } from 'cluster'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { buddyDB, pgp } from '../utils/buddy-db'
import { logger } from '../utils/logger'
import { remapKeys } from '../utils/mapper'
import { validateReqBody, validateReqUUID } from '../utils/schema-validation'

const therapistsRoute = express.Router()

// get all therapists of user
therapistsRoute.get(
   '/',
   expressAsyncHandler(async (req, res) => {
      const therapists = await buddyDB.task(async (t) => {
         let therapistBasics: TherapistHavingID[] = await t.manyOrNone(generateUsersTherapistsQuery(res.locals.userID))

         if (therapistBasics.length > 0) {
            const therapistIDList = therapistBasics.map((ther) => ther.id)

            let callTimes: CalltimeHavingID[] = await t.manyOrNone(generateUsersCallTimesQuery(therapistIDList))
            therapistBasics = mergeTherapistsWithCallTimes(therapistBasics, callTimes)

            let addresses: AddressHavingID[] = await t.manyOrNone(generateUsersAddressesQuery(therapistIDList))
            therapistBasics = mergeTherapistsWithAddress(therapistBasics, addresses)
         }

         return therapistBasics
      })

      res.send(therapists)
   })
)

// add therapist
therapistsRoute.post(
   '/',
   validateReqBody(AddTherapistSchema),
   expressAsyncHandler(async (req, res) => {
      // if user sends name, create new therapist
      // if user sends id, clone therapist from shared therapists table to users table
      const { name, id } = req.body
      let therapist: Therapist

      if (name) {
         therapist = await buddyDB.one(
            `insert into users_therapists (name, user_id) values ($1,$2) returning id`,
            [name, res.locals.userID],
            (res) => ({ id: res.id, name })
         )
      } else if (id) {
         therapist = await buddyDB.tx(async (t) => {
            //  move shared therapist to users_therapist
            const baseTherapist = await t.one<TherapistHavingID>(
               `
                INSERT INTO users_therapists (user_id, name, email, phone, therapy_types)
                SELECT $1, name, email, phone, therapy_types FROM shared_therapists
                WHERE id = $2
                RETURNING id, name, email, phone, therapy_types;
            `,
               [res.locals.userID, id]
            )

            // move callTimes to therapist (should they exist)
            const address = await t.oneOrNone<Address>(
               `
                 INSERT INTO users_addresses (therapist_id, street, number, city, postal_code)
                 SELECT $1, street, number, city, postal_code FROM shared_addresses
                 WHERE therapist_id=$2
                 RETURNING street, number, city, postal_code
             `,
               [baseTherapist.id, id]
            )

            // move callTimes to therapist (should they exist)
            const callTimes = await t.manyOrNone<CallTime[]>(
               `
                INSERT INTO users_call_times (therapist_id, "from", "to", "weekday")
                SELECT $1, "from", "to", "weekday" FROM shared_call_times 
                WHERE therapist_id=$2
                RETURNING "from", "to", "weekday", reminder
            `,
               [baseTherapist.id, id]
            )

            return { ...baseTherapist, callTimes, address } as Therapist
         })
      } else {
         throw createHttpError(400)
      }

      res.send(therapist)
   })
)

// update
therapistsRoute.patch(
   '/:id',
   validateReqUUID,
   validateReqBody(TherapistSchema),
   expressAsyncHandler(async (req, res) => {
      const userID = res.locals.userID
      const therapist: Therapist = { ...req.body }
      const therapistID = req.params.id

      const { address } = therapist
      delete therapist.address

      const { callTimes } = therapist
      delete therapist.callTimes

      let affectedRows = 0

      await buddyDB.tx(async (t) => {
         const userOwnsTherapist = await t.one(
            'select exists(select 1 from users_therapists where user_id=$1 and id=$2)',
            [userID, therapistID],
            (result) => !!result.exists
         )

         if (!userOwnsTherapist) throw createHttpError(404)

         // update values in users_therapists
         if (therapist && Object.keys(therapist).length > 0) {
            const mappedTherapist = remapKeys(therapist)
            const update = pgp.helpers.update(mappedTherapist, null, 'users_therapists')

            affectedRows += await t.result(`${update} WHERE id=$1`, therapistID, (result) => result.rowCount)
         }

         // delete all address is null
         // if is array having values, replace all in table
         if (address === null) {
            affectedRows += await t.result(`DELETE FROM users_addresses WHERE therapist_id=$1`, therapistID, (result) => result.rowCount)
         } else if (address && Object.keys(address).length > 0) {
            const mappedAddress = remapKeys(address)
            const insert = pgp.helpers.insert({ therapist_id: therapistID, ...mappedAddress }, null, 'users_addresses')
            const updateSet = pgp.helpers.sets(address)

            affectedRows += await t.result(`${insert} ON CONFLICT (therapist_id) DO UPDATE SET ${updateSet}`, null, (result) => result.rowCount)
         }

         // delete all callTimes is null
         // if is array having values, replace all in table
         if (callTimes === null) {
            await t.result('DELETE FROM users_call_times WHERE therapist_id=$1', therapistID)
         } else if (callTimes?.length > 0) {
            await t.result('DELETE FROM users_call_times WHERE therapist_id=$1', therapistID)
            const ctwID = callTimes.map((ct) => ({ therapist_id: therapistID, ...ct }))
            const ins = pgp.helpers.insert(ctwID, ['therapist_id', 'from', 'to', 'weekday', 'reminder'], 'users_call_times')

            affectedRows += await t.result(ins, null, (result) => result.rowCount)
         }
      })

      if (affectedRows === 0) {
         logger.error(req.body, 'No rows for therapist where updated based on this request body')
      }

      res.send()
   })
)

// delete therapist from user
therapistsRoute.delete(
   '/:id',
   validateReqUUID,
   expressAsyncHandler(async (req, res) => {
      const affectedRows = await buddyDB.result('DELETE FROM users_therapists WHERE id=$1', req.params.id, (result) => result.rowCount)

      if (affectedRows === 0) throw createHttpError(404, 'Therapist not found or already deleted')
      res.send()
   })
)

//get therapistlist by namesegment for therapistssearch
// TODO: implement filters
therapistsRoute.post(
   '/find',
   validateReqBody(TherapistSearchSchema),
   expressAsyncHandler(async (req, res) => {
      const searchParams: TherapistSearch = req.body

      const therapists = await buddyDB.manyOrNone(generateFindSharedTherapistsQuery(searchParams.name))

      res.send(therapists)
   })
)

// Helpers
// shared
function generateFindSharedTherapistsQuery(name: string): string {
   const query = pgp.as.format(
      `
        SELECT name, email, phone, therapy_types, id
        FROM shared_therapists
        WHERE name ILIKE $1 LIMIT 9`,
      `%${name}%`
   )

   return query
}

function generateSharedCallTimesQuery(therapistIDs: string[]): string {
   const whereClause = pgp.as.format('WHERE therapist_id IN ($1:csv)', [therapistIDs])
   const query = `SELECT "from", "to", "weekday", "therapist_id" FROM shared_call_times ${whereClause}`

   return query
}

function generateSharedAddressesQuery(therapistIDs: string[]): string {
   const whereClause = pgp.as.format('WHERE therapist_id IN ($1:csv)', [therapistIDs])
   const query = `SELECT * FROM shared_address ${whereClause}`

   return query
}

//users
function generateUsersTherapistsQuery(userID: string): string {
   const query = pgp.as.format(
      `
        SELECT name, email, phone, free_from, therapy_types, note, id
        FROM users_therapists
        WHERE user_id = $1`,
      userID
   )

   return query
}

function generateUsersCallTimesQuery(therapistIDs: string[]): string {
   const whereClause = pgp.as.format('WHERE therapist_id IN ($1:csv)', [therapistIDs])
   const query = `SELECT "from", "to", "weekday", "reminder", "therapist_id" FROM users_call_times ${whereClause}`

   return query
}

function generateUsersAddressesQuery(therapistIDs: string[]): string {
   const whereClause = pgp.as.format('WHERE therapist_id IN ($1:csv)', [therapistIDs])
   const query = `SELECT city, street, number, postal_code, therapist_id FROM users_addresses ${whereClause}`

   return query
}

function mergeTherapistsWithCallTimes(therapists: TherapistHavingID[], callTimes: CalltimeHavingID[]): TherapistHavingID[] {
   const selectCorrectCT = (thID, cts) =>
      cts
         .filter((ct) => ct.therapistID === thID)
         .map((ct) => {
            delete ct.therapistID
            return ct
         })

   return therapists.map((th) => {
      const callTimesOfTh = selectCorrectCT(th.id, callTimes)

      if (callTimesOfTh.length > 0) {
         return { ...th, callTimes: callTimesOfTh }
      }
      return th
   })
}

function mergeTherapistsWithAddress(therapists: TherapistHavingID[], address: AddressHavingID[]): TherapistHavingID[] {
   return therapists.map((th) => {
      const addressOfTh = address.find((ad) => ad.therapistID === th.id)

      if (addressOfTh) {
         delete addressOfTh.therapistID
         return { ...th, address: addressOfTh }
      }
      return th
   })
}

export = therapistsRoute
