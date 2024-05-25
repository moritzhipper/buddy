export const TherapyTypeList = [
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
] as const

export const Weekdays = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'] as const

export enum BuddyRoutes {
   THERAPISTS = '/therapists',
   PROFILE = '/profile',
}
