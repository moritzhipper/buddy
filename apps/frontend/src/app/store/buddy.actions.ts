import { HttpErrorResponse } from '@angular/common/http'
import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store'
import { Appointment, Goal, Note, Settings, Therapist, UserLogin, UserProfile } from '../models'

// Crud
type CrudResources = 'Therapist' | 'Note' | 'Goal' | 'Appointment'
const createCrudActions = <T>(name: string) =>
   createActionGroup({
      source: name as CrudResources,
      events: {
         Create: props<{ props: T }>(),
         Update: props<{ props: T }>(),
         Save: props<{ props: T }>(),
         'Save Many': props<{ props: T[] }>(),
         Delete: props<{ id: string }>(),
         'Delete Success': props<{ id: string }>(),
      },
   })

export const getTherapistSuggestions = createAction('[Therapist] Suggestion', props<{ filter: { name: string } }>)

export const therapistActions = createCrudActions<Therapist>('Therapist')
export const noteActions = createCrudActions<Note>('Note')
export const goalActions = createCrudActions<Goal>('Goal')
export const appointmentActions = createCrudActions<Appointment>('Appointment')

// Settings related
export const settingsActions = createActionGroup({
   source: 'Settings',
   events: {
      'Toggle Appointment': emptyProps(),
      Update: props<{ props: Settings }>(),
      Save: props<{ props: Settings }>(),
   },
})

// Profile related
export const profileActions = createActionGroup({
   source: 'Profile',
   events: {
      'Create Secret': emptyProps(),
      'Create Secret Success': props<{ login: UserLogin }>(),
      'Create Credentials': props<{ login: UserLogin }>(),
      'Create Credentials Success': props<{ login: UserLogin }>(),
      'Rotate Secret': emptyProps(),
      'Save Credentials': props<{ profile: UserProfile }>(),
      'Delete Profile': emptyProps(),
      'Delete Profile Success': emptyProps(),
      'Profile not existing': emptyProps(),
   },
})

// Auth related
// Silent Login is used to refresh session without userinteraction silently for non full users
export const authActions = createActionGroup({
   source: 'Auth',
   events: {
      'Handle invalid Session': emptyProps(),
      'Request Password': props<{ secret: string }>(),
      Login: props<{ login: UserLogin; redirect?: boolean }>(),
      'Login Success': props<{ session: string; redirect?: boolean }>(),
      Logout: emptyProps(),
      'Logout Success': emptyProps(),
   },
})

export const loadAllDataActions = createActionGroup({
   source: 'Load Data',
   events: {
      'Basic User': emptyProps(),
      'Full User': emptyProps(),
   },
})

// Error
export const httpErrorActions = createActionGroup({
   source: 'Auth',
   events: {
      Handle: props<{ error: HttpErrorResponse }>(),
      'Handle Unspecific': props<{ error: HttpErrorResponse }>(),
   },
})
