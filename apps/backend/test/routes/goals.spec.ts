import { expect } from 'chai'
import { Routes } from '../../src/routes/route-names'
import { Goal } from '../../src/types-and-schemas/types'
import { BuddyTestSetup } from '../buddy-test-setup'

describe('Goals', () => {
   const bt = new BuddyTestSetup()

   let goalID

   before(async () => {
      await bt.createUser()
   })

   after(async () => {
      await bt.deleteUser()
      bt.destruct()
   })
   it('Get empty list when no goals are present', async () => {
      const res = await bt.get(Routes.GOALS).send()

      expect(res).to.have.status(200)
      expect(res.body).to.have.length(0)
   })

   it('Add goals sucessfully', async () => {
      const newGoal: Goal = {
         body: 'Better myself',
      }

      const addGoalRes = await bt.post(Routes.GOALS).send(newGoal)
      expect(addGoalRes).to.have.status(200)

      goalID = addGoalRes.body.id

      const goalRes = await bt.get(Routes.GOALS).send()
      expect(goalRes).to.have.status(200)

      const goal = goalRes.body.find((g) => g.id === goalID)

      expect(goal.body).to.equal(newGoal.body)
   })

   it('Update goal succesfully', async () => {
      const updatedGoal: Goal = {
         body: 'Newer text',
      }

      await bt.patch(Routes.GOALS + '/' + goalID).send(updatedGoal)

      const goalRes = await bt.get(Routes.GOALS).send()
      expect(goalRes).to.have.status(200)

      const goal = goalRes.body.find((n) => n.id === goalID)

      expect(goal.body).to.equal(updatedGoal.body)
   })

   it('Sucessfully delete note', async () => {
      expect(await bt.delete(Routes.GOALS + '/' + goalID).send()).to.have.status(200)

      const resGet = await bt.get(Routes.GOALS).send()
      expect(resGet).to.have.status(200)
      expect(resGet.body).to.have.length(0)
   })
})
