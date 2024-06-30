import { z } from 'zod'
import { TherapyTypeList, Weekdays } from './constants'

// Date String
const JustDateSchema = z.string().regex(/\b\d{4}-\d{2}-\d{2}\b/)

// General
export const UUIDSchema = z.string().uuid()

// Settings
export const SettingsSchema = z
   .object({
      appointmentPrecautionTime: z.number().optional(),
      shareTherapistData: z.boolean().optional(),
      remindNextAppointment: z.boolean().optional(),
      callPrecautionTime: z.number().optional(),
   })
   .strict()

// User
export const UserNameSchema = z
   .object({
      name: z.string(),
   })
   .strict()

// Auth
export const EmailSchema = z.string().email()
export const PasswordSchema = z.string().min(12)
export const BuddySecretSchema = z.string().length(48)

export const UserProfileScheme = z
   .object({
      secret: BuddySecretSchema.optional(),
      callPrecautionTime: z.number().optional(),
   })
   .strict()

// Appointment
const WeekdayScheme = z.enum(Weekdays)

// Therapist
export const CallTimeSchema = z
   .object({
      from: z.string(),
      to: z.string(),
      weekday: WeekdayScheme,
      reminder: z.boolean(),
   })
   .strict()

export const AddressSchema = z
   .object({
      street: z.string().optional(),
      city: z.string().optional(),
      number: z.string().optional(),
      postalCode: z.number().int().gte(0).lte(99999),
   })
   .strict()

export const TherapistSchema = z
   .object({
      name: z.string().optional(),
      note: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      email: EmailSchema.nullable().optional(),
      address: AddressSchema.nullable().optional(),
      therapyTypes: z.array(z.enum(TherapyTypeList)).nullable().optional(),
      callTimes: z.array(CallTimeSchema).nullable().optional(),
      freeFrom: JustDateSchema.nullable().optional(),
      id: UUIDSchema.optional(),
   })
   .strict()

export const TherapistSearchSchema = z
   .object({
      name: z.string().optional(),
      city: z.string().optional(),
      postalCodes: z.array(z.string()).optional(),
      therapyTypes: z.array(z.enum(TherapyTypeList)).optional(),
   })
   .strict()

export const AddTherapistSchema = z
   .object({
      name: z.string().optional(),
      id: UUIDSchema.optional(),
   })
   .strict()

export const PushSubscriptionSchema = z
   .object({
      endpoint: z.string(),
      expirationTime: z.null(),
      keys: z.object({
         auth: z.string(),
         p256dh: z.string(),
      }),
   })
   .strict()
