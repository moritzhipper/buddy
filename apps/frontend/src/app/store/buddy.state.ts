import { Therapist, TherapistSearch, UserProfile } from '@buddy/base-utils'

export class BuddyState {
   therapists: Therapist[]
   profile: UserProfile
   search: TherapistSearch
}
