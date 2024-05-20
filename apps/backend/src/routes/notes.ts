import express from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { buddyDB, pgp } from "../buddy-db";
import { remapKeys } from "../mapper";
import { NoteSchema, validateReqBody, validateReqUUID } from "../types-and-schemas/validation-schemas";

const notesRoute = express.Router();

// read notes
notesRoute.get('/', expressAsyncHandler(async (req, res) => {
    const notes = await buddyDB.manyOrNone('SELECT id, body, created_at, is_important FROM notes WHERE user_id=$1', res.locals.userID);

    res.send(notes);
}));

// create
notesRoute.post('/', validateReqBody(NoteSchema), expressAsyncHandler(async (req, res) => {
    if (!req.body?.body) throw createHttpError(400, 'Note body is reqired on create');

    const noteForBE = remapKeys(req.body);
    const createSet = pgp.helpers.insert({ ...noteForBE, user_id: res.locals.userID }, null, 'notes');
    const note = await buddyDB.one(`${createSet} RETURNING id, created_at`);

    res.send({ ...noteForBE, ...note });
}));

// update
notesRoute.patch('/:id', validateReqUUID, validateReqBody(NoteSchema), expressAsyncHandler(async (req, res) => {
    const mappedNote = remapKeys(req.body);
    const update = pgp.helpers.update(mappedNote, null, 'notes');

    const affectedRows = await buddyDB.result(`${update} WHERE user_id=$1 AND id=$2 `,
        [res.locals.userID, req.params.id],
        result => result.rowCount
    );

    if (affectedRows === 0) throw createHttpError(404, 'Note not found');

    res.send();
}));

notesRoute.delete('/:id', validateReqUUID, expressAsyncHandler(async (req, res) => {
    const affectedRows = await buddyDB.result('DELETE FROM notes WHERE user_id=$1 AND id=$2', [res.locals.userID, req.params.id], result => result.rowCount);

    if (affectedRows === 0) throw createHttpError(404, 'Note not found or already deleted');
    res.send();
}));

export = notesRoute;