import createHttpError from "http-errors";
import { ZodObject, ZodRawShape, z } from "zod";
import { logger } from "../logger";

/**
 * Validates request body against Zod scheme
 * Returns HTTP 400 if Validation fails
 * @param zodScheme 
 */
export function validateReqBody<T extends ZodRawShape>(zodScheme: ZodObject<T>) {
    return (req, res, next) => {
        try {
            if (Object.keys(req.body).length <= 0) throw Error('No values in request body');
            zodScheme.parse(req.body);
            next();
        } catch (e) {
            logger.error(e.message);
            throw createHttpError(400);
        }
    }
}

/**
 * Express middleware that reads url parameter id and validates wit ZOD if it is a valid UUID
 */
export function validateReqUUID(req, res, next) {
    try {
        UUIDSchema.parse(req.params.id);
        next();
    } catch (e) {
        logger.error(e.message);
        throw createHttpError(400, 'Invalid uuid');
    }
}

// check if is date
const JustDateSchema = z.string().regex(/\b\d{4}-\d{2}-\d{2}\b/);

// General
export const UUIDSchema = z.string().uuid();

// Settings
export const SettingsSchema = z.object({
    appointmentPrecautionTime: z.number().optional(),
    shareTherapistData: z.boolean().optional(),
    remindNextAppointment: z.boolean().optional(),
    callPrecautionTime: z.number().optional()
}).strict();


// User 
export const UserNameSchema = z.object({
    name: z.string(),
}).strict();

// Auth
export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(12);
export const BuddySecretSchema = z.string().length(48);

export const UserEmailSchema = z.object({
    email: EmailSchema
}).strict();

export const UserPasswordSchema = z.object({
    password: PasswordSchema
}).strict();

export const UserCredentialsSchema = z.object({
    email: EmailSchema.optional(),
    secret: BuddySecretSchema.optional(),
    password: PasswordSchema.optional()
}).strict();


// Appointment
const WeekdayScheme = z.enum(['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so']);

export const AppointmentSchema = z.object({
    therapistID: z.string().uuid().optional(),
    isRepeating: z.boolean().optional(),
    weekday: WeekdayScheme.nullable().optional(),
    date: JustDateSchema.nullable().optional(),
    from: z.string().optional(),
    to: z.string().optional()
}).strict();


// Note
export const NoteSchema = z.object({
    body: z.string().optional(),
    isImportant: z.boolean().optional()
}).strict();


// Goal
export const GoalSchema = z.object({
    body: z.string().max(60)
}).strict();


// Therapist
export const CallTimeSchema = z.object({
    from: z.string(),
    to: z.string(),
    weekday: WeekdayScheme,
    reminder: z.boolean()
}).strict();

export const AddressSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    number: z.string().optional(),
    postalCode: z.number().int().gte(0).lte(99999)
}).strict();

export const TherapistSchema = z.object({
    name: z.string().optional(),
    note: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    email: EmailSchema.nullable().optional(),
    address: AddressSchema.nullable().optional(),
    therapyTypes: z.array(z.string().min(3).max(40)).max(20).nullable().optional(),
    callTimes: z.array(CallTimeSchema).nullable().optional(),
    freeFrom: JustDateSchema.nullable().optional(),
}).strict();

export const TherapistSearchSchema = z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    therapyTypes: z.array(z.string()).optional()
}).strict();

export const AddTherapistSchema = z.object({
    name: z.string().optional(),
    id: UUIDSchema.optional()
}).strict();


