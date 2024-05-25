import { CallTime, UniqueItem } from '@buddy/base-utils'

export enum ToastType {
   ERROR,
   SUCCESS,
}

export interface Toast {
   text: string
   type?: ToastType
}

export interface CalendarItem {
   callTime: CallTime
   phone: string
   therapistName: string
}

export enum weekdays {
   SO = 'so',
   MO = 'mo',
   DI = 'di',
   MI = 'mi',
   DO = 'do',
   FR = 'fr',
   SA = 'sa',
}

export const WeekdaysMap: { [key in weekdays]: string } = {
   [weekdays.SO]: 'Sonntag',
   [weekdays.MO]: 'Montag',
   [weekdays.DI]: 'Dienstag',
   [weekdays.MI]: 'Mittwoch',
   [weekdays.DO]: 'Donnerstag',
   [weekdays.FR]: 'Freitag',
   [weekdays.SA]: 'Samstag',
}

export interface Therapist extends UniqueItem {
   name?: string
   address?: Address
   freeFrom?: string
   note?: string
   email?: string
   phone?: string
   callTimes?: CallTime[]
   therapyTypes?: string[]
}

export const TherapyTypeList: string[] = [
   'Verhaltenstherapie',
   'Kognitive Verhaltenstherapie (KVT)',
   'Tiefenpsychologisch fundierte Psychotherapie',
   'Psychoanalyse',
   'Gesprächspsychotherapie',
   'Systemische Therapie',
   'Gestalttherapie',
   'Interpersonelle Psychotherapie (IPT)',
   'Dialektisch-Behaviorale Therapie (DBT)',
   'Schema-Therapie',
   'Narrative Therapie',
   'Kunsttherapie',
   'Musiktherapie',
   'Tanztherapie',
   'Achtsamkeitsbasierte Therapieansätze',
]

export interface Note extends UniqueItem {
   body?: string
   createdAt?: Date
   isImportant?: boolean
}

export interface Goal extends UniqueItem {
   createdAt?: Date
   body?: string
}

export interface Address {
   street?: string
   number?: string
   city?: string
   postalCode?: number
}

// holding info about user
export interface UserProfile {
   secret?: string
   callPrecautionTime?: number
}
