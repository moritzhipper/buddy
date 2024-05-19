import express from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { buddyDB, pgp } from "../buddy-db";
import { remapKeys } from "../mapper";
import { Appointment } from "../types-and-schemas/types";
import { AppointmentSchema, validateReqBody, validateReqUUID } from "../types-and-schemas/validation-schemas";


const appointmentsRoute = express.Router();


appointmentsRoute.get('/', expressAsyncHandler(async (req, res) => {
    const appointments = await buddyDB.manyOrNone(
        `SELECT is_repeating, weekday, date, "from", "to", id FROM appointments WHERE user_id=$1`,
        res.locals.userID
    );

    res.send(appointments);
}));


appointmentsRoute.post('/', validateReqBody(AppointmentSchema), expressAsyncHandler(async (req, res) => {
    const appointment: Appointment = { ...req.body };

    const hasDay = appointment.isRepeating ? !!appointment.weekday : !!appointment.date;
    if (!hasDay) throw createHttpError(400, 'Either weekday or date of appointment have to be set');

    const hasTime = !!appointment.from && !!appointment.to;
    if (!hasTime) throw createHttpError(400, 'Attributes From and To have to be set');

    const appointmentForBE = remapKeys(req.body);
    const insert = pgp.helpers.insert({ ...appointmentForBE, user_id: res.locals.userID }, null, 'appointments');
    const id = await buddyDB.one(`${insert} returning id`, null, result => result.id);

    res.send({ id, ...appointment });
}));


appointmentsRoute.patch('/:id', validateReqUUID, validateReqBody(AppointmentSchema), expressAsyncHandler(async (req, res) => {
    const appointmentForBe = remapKeys(req.body);
    const update = pgp.helpers.update(appointmentForBe, null, 'appointments');

    await buddyDB.none(`${update} WHERE user_id=$1 and id=$2`, [res.locals.userID, req.params.id]);

    res.send();
}));


appointmentsRoute.delete('/:id', validateReqUUID, expressAsyncHandler(async (req, res) => {
    const affectedRows = await buddyDB.result('DELETE FROM appointments WHERE user_id=$1 AND id=$2', [res.locals.userID, req.params.id], result => result.rowCount);
    if (affectedRows === 0) throw createHttpError(404, 'Appointment not found or already deleted');

    res.send();
}));

export = appointmentsRoute;