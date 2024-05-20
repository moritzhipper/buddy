import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src'
import { Routes } from '../src/routes/route-names'

export class BuddyTestSetup {
   readonly email = 'vorname@test.com'
   readonly password = 'qqweqweq7we767'
   private _sessionCookie
   secret: string

   readonly agent: ChaiHttp.Agent

   constructor() {
      chai.use(chaiHttp)
      this.agent = chai.request.agent(app)
   }

   destruct() {
      this.agent.close()
   }

   get(route: string) {
      return this.agent.get(route).set('Cookie', this._sessionCookie)
   }

   post(route: string) {
      return this.agent.post(route).set('Cookie', this._sessionCookie)
   }

   patch(route: string) {
      return this.agent.patch(route).set('Cookie', this._sessionCookie)
   }

   delete(route: string) {
      return this.agent.delete(route).set('Cookie', this._sessionCookie)
   }

   async createUser() {
      let sessionID

      const createRes = await this.agent.post(Routes.USER).send()

      this.secret = createRes.body.secret

      const loginRes1 = await this.agent.post('/auth/sessions').set('Buddy-Secret', this.secret).send()

      sessionID = loginRes1.body.session

      await this.agent
         .post(Routes.AUTH + '/cred')
         .set('Cookie', `sessionID=${sessionID}`)
         .send({
            password: this.password,
            email: this.email,
         })

      const loginRes2 = await this.agent.post('/auth/sessions').auth(this.email, this.password).send()

      this._sessionCookie = `sessionID=${loginRes2.body.session}`

      if (!this._sessionCookie) throw new Error('Could not create user')
   }

   async deleteUser() {
      await this.delete(Routes.USER).send()
   }

   // TODO Keep or delete depending on how session is stored in FE
   private readSessionfromCookieHeader(res) {
      return res.header['set-cookie'][0].split(';')[0].split('=')[1]
   }
}
