import { expect } from "chai";
import { Routes } from "../../src/routes/route-names";
import { Therapist, TherapistHavingID } from "../../src/types-and-schemas/types";
import { BuddyTestSetup } from "../buddy-test-setup";


describe('Therapists ', () => {
    const bt = new BuddyTestSetup();

    before(async () => {
        await bt.createUser();
    })

    after(async () => {
        await bt.deleteUser();
        bt.destruct();
    });

    describe('General', () => {
        it('Get empty list when no therapists are present', async () => {
            const res = await bt.get(Routes.THERAPISTS).send();

            expect(res).to.have.status(200);
            expect(res.body).to.have.length(0);
        });

        it('Should create two therapists and return them with id', async () => {
            const name1 = 'Felia die Weise';
            const name2 = 'Dr. Widemann';

            const ther1Res = await bt.post(Routes.THERAPISTS).send({ name: name1 });
            const ther2Res = await bt.post(Routes.THERAPISTS).send({ name: name2 });

            expect(ther1Res.body.id).to.be.ok;
            expect(ther2Res.body.id).to.be.ok;

            const therapistsRes = await bt.get(Routes.THERAPISTS).send();
            const therapistNames = therapistsRes.body.map(t => t.name);

            expect(therapistNames).to.include(name1);
            expect(therapistNames).to.include(name2);
        });

        it('Should create a therapist and succesfully delete them', async () => {
            const resCreate = await bt.post(Routes.THERAPISTS).send({ name: 'Therapierende Person X' });
            const therapistID = resCreate.body.id;

            const resDel = await bt.delete(Routes.THERAPISTS + '/' + therapistID);

            expect(resDel).to.have.status(200);

            const therapistsRes = await bt.get(Routes.THERAPISTS).send();
            const therapists = therapistsRes.body.map(t => t.id);

            expect(therapists).to.not.include(therapistID);
        });
    });

    describe('Setting and updating one therapist', () => {
        let therapistID;

        it('Should successfully add info to a therapist (for table therapists)', async () => {
            const resCreate = await bt.post(Routes.THERAPISTS).send({ name: 'Therapierende Person 404' });
            therapistID = resCreate.body.id;

            let addedData: Therapist = {
                email: 'test@was.com',
                therapyTypes: ['gruppe', 'musik'],
                phone: '121212121',
                freeFrom: '2024-12-31'
            }

            const resAdd = await bt.patch(Routes.THERAPISTS + '/' + therapistID).send(addedData);

            expect(resAdd).to.have.status(200);

            const resAddedTher = await bt.get(Routes.THERAPISTS).send();
            const addedTher = resAddedTher.body.find(t => t.id === therapistID);

            expect(addedTher.email).to.equal(addedData.email);
            expect(addedTher.therapyTypes).to.eql(addedData.therapyTypes)
            expect(addedTher.phone).to.equal(addedData.phone);
            expect(addedTher.freeFrom).to.equal(addedData.freeFrom);
        });

        it('Should successfully add info to a therapist (table note, address)', async () => {
            // todo: note, address, callTimes
            const addedData: Therapist = {
                address: {
                    street: 'Teststraße',
                    number: '122',
                    postalCode: 11212,
                    city: 'Testgart'
                },
                note: 'Testnotiz'
            };
            const resAdd = await bt.patch(Routes.THERAPISTS + '/' + therapistID).send(addedData);

            expect(resAdd).to.have.status(200);

            const therapistRes = await bt.get(Routes.THERAPISTS).send();
            const therapist: TherapistHavingID = therapistRes.body.find(t => t.id === therapistID);

            expect(therapist.address).to.eql(addedData.address);
            expect(therapist.note).to.eql(addedData.note);
        });

        it('Should successfully add info to a therapist (table call_times)', async () => {
            // initially set call times
            const addedData: Therapist = {
                callTimes: [
                    {
                        from: '1:00',
                        to: '2:12',
                        weekday: 'mo',
                        reminder: false
                    },
                    {
                        from: '2:00',
                        to: '4:12',
                        weekday: 'di',
                        reminder: true
                    }
                ],
            };

            const resAdd = await bt.patch(Routes.THERAPISTS + '/' + therapistID).send(addedData);

            expect(resAdd).to.have.status(200)

            const therapistRes = await bt.get(Routes.THERAPISTS).send();
            const therapist: TherapistHavingID = therapistRes.body.find(t => t.id === therapistID);

            expect(therapist.callTimes).to.eql(addedData.callTimes);


            // update call times, delete one
            const addedData2: Therapist = {
                callTimes: [
                    {
                        from: '1:00',
                        to: '2:12',
                        weekday: 'mo',
                        reminder: false
                    }
                ]
            };

            const resAdd2 = await bt.patch(Routes.THERAPISTS + '/' + therapistID).send(addedData2);

            expect(resAdd2).to.have.status(200)

            const therapist2Res = await bt.get(Routes.THERAPISTS).send();
            const therapist2: TherapistHavingID = therapist2Res.body.find(t => t.id === therapistID);

            expect(therapist2.callTimes).to.eql(addedData2.callTimes);
        });
    });
});