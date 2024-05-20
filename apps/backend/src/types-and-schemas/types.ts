import { z } from "zod";
import { AddressSchema, AppointmentSchema, CallTimeSchema, GoalSchema, NoteSchema, SettingsSchema, TherapistSchema, TherapistSearchSchema, UserCredentialsSchema } from "./validation-schemas";

export type Therapist = z.infer<typeof TherapistSchema>;
export type CallTime = z.infer<typeof CallTimeSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type TherapistSearch = z.infer<typeof TherapistSearchSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>
export type UserCredentials = z.infer<typeof UserCredentialsSchema>

type TherapistID = { therapistID: string; }
type ID = { id: string; }

export type CalltimeHavingID = CallTime & TherapistID;
export type TherapistHavingID = Therapist & ID;
export type AddressHavingID = Address & TherapistID;
