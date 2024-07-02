import { HttpErrorResponse } from '@angular/common/http'
import { Therapist, TherapistSearch, UniqueItem, UserProfile } from '@buddy/base-utils'
import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store'

export const getTherapistSuggestions = createAction('[Therapist] Suggestion', props<{ filter: { name: string } }>)

export const therapistActions = createActionGroup({
   source: 'Therapists',
   events: {
      Create: props<{ props: Therapist }>(),
      Update: props<{ props: Therapist }>(),
      Save: props<{ props: Therapist }>(),
      'Save Many': props<{ props: Therapist[] }>(),
      Delete: props<UniqueItem>(),
      'Delete Success': props<UniqueItem>(),
   },
})

// Profile related
export const profileActions = createActionGroup({
   source: 'Profile',
   events: {
      'Create Profile': emptyProps(),
      'Create Profile Success': props<{ profile: UserProfile }>(),
      'Load Profile': props<{ secret: string }>(),
      'Load Profile Success': props<{ profile: UserProfile }>(),
      'Rotate Secret': emptyProps(),
      Update: props<{ profile: UserProfile }>(),
      'Update Success': props<{ profile: UserProfile }>(),
      'Delete Profile': emptyProps(),
      'Delete Profile Success': emptyProps(),
      Logout: emptyProps(),
   },
})

export const searchActions = createActionGroup({
   source: 'Search',
   events: {
      'Save Search': props<{ props: TherapistSearch }>(),
      'Fetch Search Results': emptyProps(),
      'Save Search Results': props<{ results: Therapist[] }>(),
      'Reset Filter': emptyProps(),
   },
})

export const localConfigActions = createActionGroup({
   source: 'Local Config',
   events: {
      'Verify Notifications Permission': emptyProps(),
      'Notification Verification Successfull': emptyProps(),
      'Remove Notification Permission': emptyProps(),
      'Notification Removal Successfull': emptyProps(),
   },
})
export const httpErrorAction = createAction('Http Error', props<{ error: HttpErrorResponse }>())
export const errorToastAction = createAction('Error Toast', props<{ message: string }>())
