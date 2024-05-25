import { HttpErrorResponse } from '@angular/common/http'
import { Therapist, UniqueItem } from '@buddy/base-utils'
import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store'
import { UserProfile } from '../models'

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
      'Rotate Secret Success': props<{ secret: string }>(),
      Update: props<{ profile: UserProfile }>(),
      'Delete Profile': emptyProps(),
      'Delete Profile Success': emptyProps(),
      Logout: emptyProps(),
   },
})

export const httpErrorAction = createAction('Http Error', props<{ error: HttpErrorResponse }>())
export const errorToastAction = createAction('Error Toast', props<{ message: string }>())
