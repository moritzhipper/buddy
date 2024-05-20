import { Appointment, Auth, Goal, Note, Settings, Therapist, UserProfile } from '../models'

export class BuddyState {
   therapists: Therapist[]
   notes: Note[]
   goals: Goal[]
   appointments: Appointment[]
   settings: Settings
   profile: UserProfile
   auth: Auth
}
