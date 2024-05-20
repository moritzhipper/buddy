import { expect } from 'chai'
import { Routes } from '../../src/routes/route-names'
import { Appointment, Goal, Note, Therapist } from '../../src/types-and-schemas/types'
import { BuddyTestSetup } from '../buddy-test-setup'

describe('Relations', () => {
   const bt = new BuddyTestSetup()

   before(async () => {
      await bt.createUser()
   })

   after(async () => {
      await bt.deleteUser()
      bt.destruct()
   })

   it('Relate note to goal', async () => {
      // add note and goal
      const newNote: Note = { body: 'Initial text' }
      const noteRes = await bt.post(Routes.NOTES).send(newNote)
      const noteID = noteRes.body.id

      const newGoal: Goal = { body: 'Initial text' }
      const goalRes = await bt.post(Routes.GOALS).send(newGoal)
      const goalID = goalRes.body.id

      // add goalID to note
      const updatedNote: Note = { goalID }

      expect(await bt.patch(Routes.NOTES + '/' + noteID).send(updatedNote), 'Update note').to.have.status(200)

      // delete goal successfully
      expect(await bt.delete(Routes.GOALS + '/' + goalID).send(updatedNote), 'Delete goal').to.have.status(200)

      const noteAfterGoalDeletionRes = await bt.get(Routes.NOTES)
      expect(noteAfterGoalDeletionRes).to.have.status(200)
      expect(noteAfterGoalDeletionRes.body).to.be.ok
   })

   it('Relate appointment to therapist, then succesfullly delete therapist', async () => {
      // add appointment and therapist
      const appt: Appointment = { from: '2:00', to: '3:00', weekday: 'mo', isRepeating: true }
      const apptRes = await bt.post(Routes.APPOINTMENTS).send(appt)
      const apptID = apptRes.body.id

      const ther: Therapist = { name: 'Therapistname' }
      const therRes = await bt.post(Routes.THERAPISTS).send(ther)
      const therID = therRes.body.id

      // add appointmentID to therapist
      const updatedAppt: Appointment = { therapistID: therID }

      expect(await bt.patch(Routes.APPOINTMENTS + '/' + apptID).send(updatedAppt), 'Update appointment').to.have.status(200)

      // delete therapist sucessfuylly
      expect(await bt.delete(Routes.THERAPISTS + '/' + therID).send(), 'Delete therapist').to.have.status(200)
   })
})
