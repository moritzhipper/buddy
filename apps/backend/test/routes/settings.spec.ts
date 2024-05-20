import { expect } from 'chai'
import { Routes } from '../../src/routes/route-names'
import { Settings } from '../../src/types-and-schemas/types'
import { BuddyTestSetup } from '../buddy-test-setup'

describe('Settings', () => {
   const bt = new BuddyTestSetup()

   before(async () => {
      await bt.createUser()
   })

   after(async () => {
      await bt.deleteUser()
      bt.destruct()
   })

   it('Return settings with all values preset', async () => {
      const res = await bt.get(Routes.SETTINGS).send()

      expect(res).to.have.status(200)
      const settings: Settings = res.body

      Object.keys(settings).forEach((key) => {
         expect(settings[key]).to.be.ok
      })
   })

   it('Change values succesfully', async () => {
      const newSettings: Settings = {
         appointmentPrecautionTime: 20,
         callPrecautionTime: 30,
         remindNextAppointment: false,
         shareTherapistData: false,
      }

      const resSetNew = await bt.patch(Routes.SETTINGS).send(newSettings)
      expect(resSetNew).to.have.status(200)

      const resGetNew = await bt.get(Routes.SETTINGS).send()
      expect(resGetNew).to.have.status(200)

      const settings: Settings = resGetNew.body

      expect(settings).to.eql(newSettings)
   })
})
