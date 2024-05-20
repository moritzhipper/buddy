export enum ToastType {
   ERROR,
   SUCCESS,
}

export interface Toast {
   text: string
   type?: ToastType
}

export interface UniqueItem {
   id?: string
}

export interface CalendarItem {
   callTime: Remindable
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
   callTimes?: Remindable[]
   therapyTypes?: string[]
}

const furniture = ['chair', 'table', 'lamp'] as const
type Furniture = (typeof furniture)[number]

export enum TherapyType {
   ANALYTISCH = 'analytisch',
   GESPRAECH = 'gespraech',
   GESTALT = 'gestalt',
   GRUPPE = 'gruppe',
   KINDER = 'kinder',
   MUSIK = 'musik',
   PAAR = 'paar',
   PSYCHOANALYSE = 'psychoanalyse',
   SYSTEMISCH = 'systemisch',
   TIEFENPSYCHFUNDIERT = 'tiefenpsychfundiert',
   VERHALTEN = 'verhalten',
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

export interface Remindable extends UniqueItem {
   weekday: string
   from: string
   to: string
   reminder?: boolean
}

export interface Appointment extends Remindable {
   date?: string
   isRepeating: boolean
}

export interface Settings {
   callPrecautionTime?: number
   appointmentPrecautionTime?: number
   shareTherapistData?: boolean
   remindNextAppointment?: boolean
}

// holding info about user
export interface UserProfile {
   name?: string
   email?: string
   secret?: string
   isFullUser?: boolean
}

// holding short term data to create session
export interface UserLogin {
   password?: string
   email?: string
   secret?: string
}

// holding auth data
export interface Auth {
   secretNeedingPassword?: string
   session?: string
}
