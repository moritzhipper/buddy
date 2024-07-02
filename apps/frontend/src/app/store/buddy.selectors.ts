import { Therapist, UserProfile } from '@buddy/base-utils'
import { createSelector } from '@ngrx/store'
import { BuddyState, LocalConfigState, SearchState } from './buddy.state'

export const selectTherapists = createSelector(
   (state: BuddyState) => state.therapists,
   (therapists: Therapist[]) => therapists.slice().sort((a, b) => a.name.localeCompare(b.name))
)

export const selectUserProfile = createSelector(
   (state: BuddyState) => state.profile,
   (profile: UserProfile) => profile
)

export const selectSearch = createSelector(
   (state: BuddyState) => state.search,
   (search: SearchState) => search
)

export const selectLocalConfig = createSelector(
   (state: BuddyState) => state.localConfig,
   (localConfig: LocalConfigState) => localConfig
)

