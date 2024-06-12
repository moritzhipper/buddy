import {
   AddTherapistSchema,
   Address,
   AddressHavingID,
   CallTime,
   CalltimeHavingID,
   Therapist,
   TherapistSchema,
   TherapistSearch,
   TherapistSearchSchema,
} from '@buddy/base-utils'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { buddyDB, pgp } from '../utils/buddy-db'
import { logger } from '../utils/logger'
import { remapKeys } from '../utils/mapper'
import { validateReqBody, validateReqUUID } from '../utils/schema-validators'

const therapistsRoute = express.Router()

// get all therapists of user
therapistsRoute.get(
   '/',
   expressAsyncHandler(async (req, res) => {
      const therapists = await buddyDB.task(async (t) => {
         let therapistBasics: Therapist[] = await t.manyOrNone(generateUsersTherapistsQuery(res.locals.userID))

         if (therapistBasics.length > 0) {
            const therapistIDList = therapistBasics.map((ther) => ther.id)

            let callTimes: CalltimeHavingID[] = await t.manyOrNone(generateUsersCallTimesQuery(therapistIDList))
            therapistBasics = mergeTherapistsWithCallTimes(therapistBasics, callTimes)

            let addresses: AddressHavingID[] = await t.manyOrNone(generateUsersAddressesQuery(therapistIDList))
            therapistBasics = mergeTherapistsWithAddresses(therapistBasics, addresses)
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
            const baseTherapist = await t.one<Therapist>(
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
   '/search',
   validateReqBody(TherapistSearchSchema),
   expressAsyncHandler(async (req, res) => {
      const searchParams: TherapistSearch = req.body

      const flatTherapistList = await buddyDB.manyOrNone<Therapist & Address>(
         `SELECT * FROM shared_therapists t LEFT JOIN shared_addresses a ON t.id = a.therapist_id WHERE $1`,
         [getAndConditionsAsRawtype(searchParams)]
      )

      const unflattenedTherapist = flatTherapistList.map((t) => unflattenTherapist(t))
      res.send(unflattenedTherapist)
   })
)

// Helpers

/**
 * pg-promise specific functionality that allows inserting procedurally built query
 * see:https://github.com/vitaly-t/pg-promise#custom-type-formatting
 *
 * @param params
 * @returns
 */
const getAndConditionsAsRawtype = (params: TherapistSearch) => ({
   rawType: true,
   toPostgres: () => generateAndConditionsForSearch(params),
})

function generateAndConditionsForSearch(params: TherapistSearch) {
   let whereStatements = []

   // check contains
   if (params.city) {
      whereStatements.push(pgp.as.format('city ILIKE $1', `%${params.city}%`))
   }

   //check contains
   if (params.name) {
      whereStatements.push(pgp.as.format('name ILIKE $1', `%${params.name}%`))
   }

   // check equals
   if (params?.postalCodes?.length > 0) {
      // todo: add in, when search for postal array is implemented
      whereStatements.push(pgp.as.format('postal_code in ($1:csv)', params.postalCodes))
   }

   // check contains one of selected values
   if (params?.therapyTypes?.length > 0) {
      whereStatements.push(pgp.as.format('therapy_types && ARRAY[$1:csv]::varchar[]', [params.therapyTypes]))
   }

   return whereStatements.join(' AND ')
}

/**
 * Because it was necessary to join to table for the search, the response object has a depth of one containing all adress and therapist values
 * This function remaps the adress attributes in its own attribute
 *
 * @param flatTher
 * @returns
 */
function unflattenTherapist(flatTher: Therapist & Address): Therapist {
   const { postalCode, city, street, number }: Address = flatTher
   const { id, name, therapyTypes, phone, email }: Therapist = flatTher

   return { id, name, therapyTypes, phone, email, address: { postalCode, city, street, number } }
}

// user specific helper functions
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

function mergeTherapistsWithCallTimes(therapists: Therapist[], callTimes: CalltimeHavingID[]): Therapist[] {
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

function mergeTherapistsWithAddresses(therapists: Therapist[], address: AddressHavingID[]): Therapist[] {
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
