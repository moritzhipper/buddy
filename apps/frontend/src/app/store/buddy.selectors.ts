import { Therapist } from '@buddy/base-utils'
import { createSelector } from '@ngrx/store'
import { UserProfile } from '../models'
import { BuddyState } from './buddy.state'

export const selectTherapists = createSelector(
   (state: BuddyState) => state.therapists,
   (therapists: Therapist[]) => therapists.slice().sort((a, b) => a.name.localeCompare(b.name))
)

export const selectUserProfile = createSelector(
   (state: BuddyState) => state.profile,
   (profile: UserProfile) => profile
)
