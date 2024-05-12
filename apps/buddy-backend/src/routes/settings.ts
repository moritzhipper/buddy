import express from "express";
import expressAsyncHandler from "express-async-handler";
import { buddyDB, pgp } from "../buddy-db";
import { remapKeys } from "../mapper";
import { SettingsSchema, validateReqBody } from "../types-and-schemas/validation-schemas";

const settingsRoute = express.Router();

// read
settingsRoute.get('/', expressAsyncHandler(async (req, res) => {
    const settings = await buddyDB.one(
        'select call_precaution_time, appointment_precaution_time, share_therapist_data, remind_next_appointment from app_settings where user_id = $1',
        res.locals.userID
    );

    res.send(settings);
}));

// update
settingsRoute.patch('/', validateReqBody(SettingsSchema), expressAsyncHandler(async (req, res) => {
    const mappedSettings = remapKeys(req.body);
    const update = pgp.helpers.update(mappedSettings, null, 'app_settings');

    await buddyDB.none(`${update} WHERE user_id = $1`, res.locals.userID);
    res.send();
}));

export = settingsRoute;