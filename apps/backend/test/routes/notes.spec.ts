import { expect } from "chai";
import { Routes } from "../../src/routes/route-names";
import { Note } from "../../src/types-and-schemas/types";
import { BuddyTestSetup } from "../buddy-test-setup";


describe('Notes', () => {
    const bt = new BuddyTestSetup();

    let noteID;

    before(async () => {
        await bt.createUser();
    })

    after(async () => {
        await bt.deleteUser();
        bt.destruct();
    });

    it('Get empty list when no goals are present', async () => {
        const res = await bt.get(Routes.NOTES).send();

        expect(res).to.have.status(200);
        expect(res.body).to.have.length(0);
    });

    it('Add notes sucessfully', async () => {
        const newNote: Note = {
            body: 'Hello this is an important note. :)',
            isImportant: true
        };

        const addNoteRes = await bt.post(Routes.NOTES).send(newNote);
        expect(addNoteRes).to.have.status(200);

        noteID = addNoteRes.body.id;

        const noteRes = await bt.get(Routes.NOTES).send();
        expect(noteRes).to.have.status(200);

        const note = noteRes.body.find(n => n.id === noteID);

        expect(note.body).to.equal(newNote.body);
        expect(note.isImportant).to.equal(newNote.isImportant);
    });

    it('Update note succesfully', async () => {
        const updatedNote: Note = {
            body: 'New text',
            isImportant: false
        };

        await bt.patch(Routes.NOTES + '/' + noteID).send(updatedNote);

        const noteRes = await bt.get(Routes.NOTES).send();
        expect(noteRes).to.have.status(200);

        const note = noteRes.body.find(n => n.id === noteID);

        expect(note.body).to.equal(updatedNote.body);
        expect(note.isImportant).to.equal(updatedNote.isImportant);
    });

    it('Sucessfully delete note', async () => {
        const resDel = await bt.delete(Routes.NOTES + '/' + noteID).send();

        expect(resDel).to.have.status(200);

        const resGet = await bt.get(Routes.NOTES).send();

        expect(resGet).to.have.status(200);
        expect(resGet.body).to.have.length(0);
    });
});