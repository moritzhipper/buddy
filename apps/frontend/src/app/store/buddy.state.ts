import { Therapist, TherapistSearch, UserProfile } from '@buddy/base-utils'

export type SearchState = {
   parameters?: TherapistSearch
   results?: Therapist[]
}

export class BuddyState {
   therapists: Therapist[]
   profile: UserProfile
   search: SearchState
}
