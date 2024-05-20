import { expect } from "chai";
import { buddyDB } from "../../src/buddy-db";
import { Routes } from "../../src/routes/route-names";
import { BuddyTestSetup } from "../buddy-test-setup";


describe('Auth and Security', () => {
    const bt = new BuddyTestSetup();

    after(() => { bt.destruct(); });

    afterEach(async () => {
        await buddyDB.none('DELETE FROM users');
    })


    describe('Authorization related', () => {
        it('Session of not full user can not be used to access full user only route', async () => {
            // create user
            const createRes = await bt.agent
                .post(Routes.USER)
                .send();

            const secret = createRes.body.secret;

            // login
            const loginRes1 = await bt.agent
                .post('/auth/sessions')
                .set('Buddy-Secret', secret)
                .send();

            const sessionID = loginRes1.body.session;

            const notesRes = await bt.agent
                .get(Routes.NOTES)
                .set('Cookie', `sessionID=${sessionID}`)
                .send();

            expect(notesRes).to.have.status(401);
        });

        it('Login via QR-Key is not possible anymore after upgrade', async () => {
            await bt.createUser();

            const loginRes = await bt.agent
                .post('/auth/sessions')
                .set('Buddy-Secret', bt.secret)
                .send()

            expect(loginRes, 'Login via Secret').to.have.status(401);
            expect((loginRes.error as any).text).to.include('You already provided your email');
        });
    });


    describe('Session Related', () => {
        it('Succesfully deletes sessions on profile upgrade', async () => {
            const email = 'testEm2@providasdasdyer.com';
            const password = 'qwertzas121212';

            // create user
            const createRes = await bt.agent
                .post(Routes.USER)
                .send();

            const secret = createRes.body.secret;

            // create session
            const loginRes1 = await bt.agent
                .post('/auth/sessions')
                .set('Buddy-Secret', secret)
                .send();

            const sessionID = loginRes1.body.session;

            // upgrade to full profile
            expect(
                await bt.agent
                    .post(Routes.AUTH + '/cred')
                    .set('Cookie', `sessionID=${sessionID}`)
                    .send({ password, email: email }),
                'Upgrade to full profile'
            ).to.have.status(200);

            const sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(0);
        });

        it('When user creates two session from same ip, old gets deleted and replaced', async () => {
            // delete all sessions 
            await buddyDB.none('DELETE FROM sessions');

            // create user
            const createRes = await bt.agent
                .post(Routes.USER)
                .send();

            const secret = createRes.body.secret;

            // create 1 session
            await bt.agent
                .post('/auth/sessions')
                .set('Buddy-Secret', secret)
                .send();


            // create second sesseion    
            const sessionRes = await bt.agent
                .post('/auth/sessions')
                .set('Buddy-Secret', secret)
                .send();

            const sessionID = sessionRes.body.session;

            let sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(1);

            expect(
                await bt.agent.delete('/auth/sessions/all')
                    .set('Cookie', `sessionID=${sessionID}`)
                    .send(),
                'Send DELETE to logout'
            ).to.have.status(200)


            sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(0);
        });


        it('Succesfully delete session on logout: DELETE /sessions', async () => {
            // delete all sessions 
            await buddyDB.none('DELETE FROM sessions');

            // create user
            const createRes = await bt.agent
                .post(Routes.USER)
                .send();

            const secret = createRes.body.secret;

            // create 1 session
            const sessionRes = await bt.agent
                .post('/auth/sessions')
                .set('Buddy-Secret', secret)
                .send();

            const sessionID = sessionRes.body.session;


            let sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(1);

            expect(
                await bt.agent.delete('/auth/sessions')
                    .set('Cookie', `sessionID=${sessionID}`)
                    .send(),
                'Send DELETE to logout'
            ).to.have.status(200)


            sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(0);
        });

        it('Delete all sessions on profile deletion', async () => {
            // also creates session for user
            await bt.createUser();

            let sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(1);

            await bt.deleteUser();

            sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(0);
        });

        it('Delete sessions on password change', async () => {
            const newPassword = 'fghjkl2asadsa32';

            // also creates session for user
            await bt.createUser();

            let sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).not.to.be.null;

            await bt.patch('/auth/cred/password').send({ password: newPassword });

            sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(0);
        });

        it('Delete sessions on email change', async () => {
            const newEmail = 'asqwedas@wer.com';

            // also creates session for user
            await bt.createUser();

            let sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).not.to.be.null;


            expect(
                await bt.patch('/auth/cred/email').send({ email: newEmail })
            ).to.have.status(200);

            sessions = await buddyDB.manyOrNone('SELECT * FROM sessions');
            expect(sessions).to.have.length(0);
        });
    })

});
