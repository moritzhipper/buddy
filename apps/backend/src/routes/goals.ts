import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { buddyDB, pgp } from '../buddy-db'
import { remapKeys } from '../mapper'
import { GoalSchema, validateReqBody, validateReqUUID } from '../types-and-schemas/validation-schemas'

const goalsRoute = express.Router()

// read goals
goalsRoute.get(
   '/',
   expressAsyncHandler(async (req, res) => {
      const goals = await buddyDB.manyOrNone('SELECT id, body, created_at, id FROM goals WHERE user_id=$1', res.locals.userID)

      res.send(goals)
   })
)

// create
goalsRoute.post(
   '/',
   validateReqBody(GoalSchema),
   expressAsyncHandler(async (req, res) => {
      const { body } = req.body
      const goal = await buddyDB.one(`INSERT INTO goals (body, user_id) VALUES ($1, $2) RETURNING id, created_at`, [body, res.locals.userID])

      res.send({ ...goal, body })
   })
)

// update
goalsRoute.patch(
   '/:id',
   validateReqUUID,
   validateReqBody(GoalSchema),
   expressAsyncHandler(async (req, res) => {
      const mappedGoal = remapKeys(req.body)
      const update = pgp.helpers.update(mappedGoal, null, 'goals')

      const affectedRows = await buddyDB.result(
         `${update} WHERE user_id=$1 AND id=$2 `,
         [res.locals.userID, req.params.id],
         (result) => result.rowCount
      )

      if (affectedRows === 0) throw createHttpError(404, 'Goal not found')

      res.send()
   })
)

// delete
goalsRoute.delete(
   '/:id',
   validateReqUUID,
   expressAsyncHandler(async (req, res) => {
      const affectedRows = await buddyDB.result(
         'DELETE FROM goals WHERE user_id=$1 AND id=$2',
         [res.locals.userID, req.params.id],
         (result) => result.rowCount
      )

      if (affectedRows === 0) throw createHttpError(404, 'Goal not found or already deleted')

      res.send()
   })
)

export = goalsRoute
