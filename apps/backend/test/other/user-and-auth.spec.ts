import { expect } from 'chai'
import { buddyDB } from '../../src/buddy-db'
import { Routes } from '../../src/routes/route-names'
import { Appointment, Goal, Note, Therapist } from '../../src/types-and-schemas/types'
import { BuddyTestSetup } from '../buddy-test-setup'

describe('User And Auth', () => {
   const bt = new BuddyTestSetup()

   let qrOnlyUserSecret

   const email = 'qweqyxcyx@mail.com'
   const password = 'wrewer3423rvw'

   after(() => {
      bt.destruct()
   })

   afterEach(async () => {
      await buddyDB.none('DELETE FROM users')
   })

   it('Should create user successfully', async () => {
      const res = await bt.agent.post(Routes.USER).send()

      qrOnlyUserSecret = res.body.secret

      expect(res).to.have.status(200)
      expect(res.body.secret).to.be.ok
   })

   it('Using already used email throws specific error', async () => {
      // create first user using test setups credentials
      await bt.createUser()

      // create user another user
      const createRes = await bt.agent.post(Routes.USER).send()

      const secret = createRes.body.secret

      // login
      const loginRes1 = await bt.agent.post('/auth/sessions').set('Buddy-Secret', secret).send()

      const sessionID = loginRes1.body.session

      // upgrade to full profile
      const upgradeQRonlyUserRes = await bt.agent
         .post(Routes.AUTH + '/cred')
         .set('Cookie', `sessionID=${sessionID}`)
         .send({
            password: bt.password,
            email: bt.email,
         })

      const text = JSON.parse(upgradeQRonlyUserRes.text).message
      expect(text).to.equal('Email already in use')
   })

   it('Use email + password for login', async () => {
      await bt.createUser()

      expect(await bt.agent.post('/auth/sessions').auth(bt.email, bt.password).send(), 'Login with secret + pw').to.have.status(200)
   })

   it('Use secret + password for login', async () => {
      await bt.createUser()

      expect(await bt.agent.post('/auth/sessions').auth(bt.secret, bt.password).send(), 'Login with mail + pw').to.have.status(200)
   })

   it('Create profile, authenticate, upgrade profile, athenticate', async () => {
      const email = 'testEmail@provider.com'
      const password = 'qwertz121212'

      // create user
      const createRes = await bt.agent.post(Routes.USER).send()

      const secret = createRes.body.secret

      // login
      const loginRes1 = await bt.agent.post('/auth/sessions').set('Buddy-Secret', secret).send()

      let sessionID = loginRes1.body.session

      // upgrade to full profile
      await bt.agent
         .post(Routes.AUTH + '/cred')
         .set('Cookie', `sessionID=${sessionID}`)
         .send({
            password: password,
            email: email,
         })

      // login
      const loginRes2 = await bt.agent.post('/auth/sessions').auth(email, password).send()

      expect(loginRes2.body.session).to.be.ok

      sessionID = loginRes2.body.session

      expect(await bt.agent.get(Routes.NOTES).set('Cookie', `sessionID=${sessionID}`).send(), 'Get Notes').to.have.status(200)
   })

   it('Should rotate QR-Code succesfully', async () => {
      // create profile
      const createRes = await bt.agent.post(Routes.USER).send()

      const secret = createRes.body.secret

      //sessions
      const loginRes1 = await bt.agent.post('/auth/sessions').set('Buddy-Secret', secret).send()

      const sessionID = loginRes1.body.session

      // create new secret
      const newSecretRes = await bt.agent
         .patch(Routes.AUTH + '/key')
         .set('Cookie', `sessionID=${sessionID}`)
         .send()

      expect(newSecretRes, 'Create new secret').to.have.status(200)
      expect(newSecretRes.body.secret).to.be.ok
      const newSecret = newSecretRes.body.secret

      // check if new secret works
      const loginRes2 = await bt.agent
         .post(Routes.AUTH + '/sessions')
         .set('Buddy-Secret', newSecret)
         .send()

      expect(loginRes2, 'Use new key to login').to.have.status(200)
   })

   it('Change password works correctly', async () => {
      const alternativePassword = '121231lj23jl1lkl'

      await bt.createUser()

      // change password and make testcall with new password
      expect(await bt.patch(Routes.AUTH + '/cred/password').send({ password: alternativePassword }), 'Change password request').to.have.status(200)

      expect(
         await bt
            .post(Routes.AUTH + '/sessions')
            .auth(bt.email, alternativePassword)
            .send(),
         'Login with new password'
      ).to.have.status(200)
   })

   it('Change email works correctly', async () => {
      const alternativeEmail = 'asdasdasdasd@gmail.com'

      await bt.createUser()

      // change email and make testcall with new email
      expect(await bt.patch(Routes.AUTH + '/cred/email').send({ email: alternativeEmail }), 'Change email request').to.have.status(200)

      expect(
         await bt
            .post(Routes.AUTH + '/sessions')
            .auth(alternativeEmail, bt.password)
            .send(),
         'Login with new email'
      ).to.have.status(200)
   })

   it('Should clean up user related data on profile deletion', async () => {
      // create user
      await bt.createUser()

      // get userID from db
      const userID = await buddyDB.one('SELECT id FROM users WHERE email=$1', [bt.email], (result) => result.id)
      expect(userID, 'fetch urser id from db').to.be.ok

      // add data of every type for user
      const note: Note = { body: 'test' }
      expect(await bt.post(Routes.NOTES).send(note), 'Create note').to.have.status(200)

      const goal: Goal = { body: 'test' }
      expect(await bt.post(Routes.GOALS).send(goal), 'Create goal').to.have.status(200)

      const appointment: Appointment = { from: '2:00', to: '2:00', isRepeating: false, date: '2023-12-22' }
      expect(await bt.post(Routes.APPOINTMENTS).send(appointment), 'Create Appointment').to.have.status(200)

      const therapist: Therapist = { name: 'Hr. Miau' }
      expect(await bt.post(Routes.THERAPISTS).send(therapist), 'Create therapist').to.have.status(200)

      // delete user
      await bt.deleteUser()

      // check if all tables are free of userspecific data
      // users
      const user = await buddyDB.oneOrNone('SELECT * FROM notes WHERE id=$1', [userID])
      expect(user, 'user').to.be.not.ok

      // notes
      const notes = await buddyDB.oneOrNone('SELECT * FROM notes WHERE user_id=$1', [userID])
      expect(notes, 'notes').to.be.not.ok

      // goals
      const goals = await buddyDB.oneOrNone('SELECT * FROM goals WHERE user_id=$1', [userID])
      expect(goals, 'goals').to.be.not.ok

      //appointment
      const appointments = await buddyDB.oneOrNone('SELECT * FROM appointments WHERE user_id=$1', [userID])
      expect(appointments, 'appointments').to.be.not.ok

      // therapists_of_users
      const therapists = await buddyDB.oneOrNone('SELECT * FROM therapists_of_users WHERE user_id=$1', [userID])
      expect(therapists, 'therapists').to.be.not.ok

      // settings
      const settings = await buddyDB.oneOrNone('SELECT * FROM app_settings WHERE user_id=$1', [userID])
      expect(settings, 'settings').to.be.not.ok

      // sessions
      const sessions = await buddyDB.oneOrNone('SELECT * FROM sessions WHERE user_id=$1', [userID])
      expect(sessions, 'sessions').to.be.not.ok
   })
})
