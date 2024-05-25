import { z } from 'zod'
import { AddressSchema, CallTimeSchema, SettingsSchema, TherapistSchema, TherapistSearchSchema, UserProfileScheme } from './schemes'

export type Therapist = z.infer<typeof TherapistSchema>
export type CallTime = z.infer<typeof CallTimeSchema>
export type TherapistSearch = z.infer<typeof TherapistSearchSchema>
export type Settings = z.infer<typeof SettingsSchema>
export type Address = z.infer<typeof AddressSchema>
export type UserProfile = z.infer<typeof UserProfileScheme>

type TherapistID = { therapistID: string }
export type UniqueItem = { id?: string }

export type CalltimeHavingID = CallTime & TherapistID
export type AddressHavingID = Address & TherapistID
