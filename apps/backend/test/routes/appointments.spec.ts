import { expect } from 'chai'
import { Routes } from '../../src/routes/route-names'
import { Appointment } from '../../src/types-and-schemas/types'
import { BuddyTestSetup } from '../buddy-test-setup'

describe('Appointments', () => {
   const bt = new BuddyTestSetup()
   let appointmentID

   before(async () => {
      await bt.createUser()
   })

   after(async () => {
      await bt.deleteUser()
      bt.destruct()
   })

   it('Get empty list when no appointments are present', async () => {
      const res = await bt.get(Routes.APPOINTMENTS).send()
      expect(res).to.have.status(200)
      expect(res.body).to.have.length(0)
   })

   it('Adding one throws error on missing day', async () => {
      const apptWithoutDay: Appointment = {
         from: '2:00',
         to: '4:00',
         isRepeating: true,
         date: 'some datestring',
      }

      expect(await bt.post(Routes.APPOINTMENTS).send(apptWithoutDay)).to.have.status(400)
   })

   it('Adding one throws error on missing date', async () => {
      const apptWithoutDate: Appointment = {
         from: '2:00',
         to: '4:00',
         isRepeating: false,
         weekday: 'mo',
      }

      expect(await bt.post(Routes.APPOINTMENTS).send(apptWithoutDate)).to.have.status(400)
   })

   it('Adding one throws error on missing time', async () => {
      const apptWithoutTime: Appointment = {
         isRepeating: false,
         date: 'some datestring',
      }

      expect(await bt.post(Routes.APPOINTMENTS).send(apptWithoutTime)).to.have.status(400)
   })

   it('Add appointment succesfully', async () => {
      const newOneTimeAppntmnt: Appointment = {
         from: '2:00',
         to: '4:00',
         date: '2023-12-22',
         isRepeating: false,
      }

      const res = await bt.post(Routes.APPOINTMENTS).send(newOneTimeAppntmnt)
      expect(res, 'Add appointment').to.have.status(200)
      appointmentID = res.body.id

      const resGet = await bt.get(Routes.APPOINTMENTS).send()
      expect(resGet, 'Get appointments').to.have.status(200)

      const apptIDs = resGet.body.map((a) => a.id)
      expect(apptIDs).to.include(appointmentID)
   })

   it('Update appointment succesfully', async () => {
      const updateAppt: Appointment = {
         weekday: 'di',
         isRepeating: true,
      }

      expect(await bt.patch(Routes.APPOINTMENTS + '/' + appointmentID).send(updateAppt)).to.have.status(200)

      const res = await bt.get(Routes.APPOINTMENTS).send()
      expect(res).to.have.status(200)

      const appt = res.body.find((a) => a.id === appointmentID)
      expect(appt.weekday).to.equal(updateAppt.weekday)
      expect(appt.isRepeating).to.equal(updateAppt.isRepeating)
   })

   it('Delete appointment succesfully', async () => {
      expect(await bt.delete(Routes.APPOINTMENTS + '/' + appointmentID).send(), 'Delete Appointment').to.have.status(200)

      const res = await bt.get(Routes.APPOINTMENTS).send()
      expect(res).to.have.status(200)

      const apptIDs = res.body.map((a) => a.id)

      expect(apptIDs).not.to.include(appointmentID)
   })
})
