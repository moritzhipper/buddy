import { ActionReducer, createReducer, INIT, MetaReducer, on, UPDATE } from '@ngrx/store'
import { Auth, Settings, UniqueItem, UserProfile } from '../models'
import { appointmentActions, authActions, goalActions, noteActions, profileActions, settingsActions, therapistActions } from './buddy.actions'

// Works with states of type <any extends UniqueItem>[]
const createCrudReducer = <T extends UniqueItem>(crudActions, init?: T[]) => {
   const initState: T[] = init || []

   return createReducer(
      initState,
      on(crudActions.save, (state, { props }) => updateArrayByID(state, props)),
      on(crudActions.saveMany, (state, { props }) => props),
      on(crudActions.deleteSuccess, (state, { id }) => state.filter((item) => item.id !== id))
   )
}

export const therapistsReducer = createCrudReducer(therapistActions)
export const notesReducer = createCrudReducer(noteActions)
export const goalsReducer = createCrudReducer(goalActions)
export const appointmentsReducer = createCrudReducer(appointmentActions)

export const settingsReducer = createReducer(
   {} as Settings,
   on(settingsActions.save, (state, { props }) => ({ ...state, ...props }))
)

// User Profile related
export const userProfileReducer = createReducer(
   {} as UserProfile,
   on(profileActions.saveCredentials, (state, { profile }) => ({
      ...state,
      ...profile,
   }))
)

export const authReducer = createReducer(
   {} as Auth,
   on(authActions.requestPassword, (state, { secret }) => ({
      secretNeedingPassword: secret,
   })),
   on(authActions.loginSuccess, authActions.loginSuccess, (state, { session }) => ({ session })),
   on(authActions.handleInvalidSession, (state) => ({ session: null }))
)

export function storeSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
   return (state, action) => {
      const BUDDY_STATE_STORAG_KEY = 'buddyState'
      if (action.type === INIT || action.type === UPDATE) {
         const stateFromStorage = localStorage.getItem(BUDDY_STATE_STORAG_KEY)

         if (stateFromStorage) {
            try {
               console.log('found store')
               return JSON.parse(stateFromStorage)
            } catch {
               console.error('couldnt parse store from local storage. removing entry')
               localStorage.removeItem(BUDDY_STATE_STORAG_KEY)
            }
         }
         console.log('no state found')
      }
      const nextState = reducer(state, action)
      localStorage.setItem(BUDDY_STATE_STORAG_KEY, JSON.stringify(nextState))
      return nextState
   }
}

export function resetUserDataReducer(reducer: ActionReducer<any>): ActionReducer<any> {
   return (state, action) => {
      if (
         action.type === profileActions.deleteProfileSuccess.type ||
         action.type === profileActions.profileNotExisting.type ||
         action.type === authActions.logoutSuccess.type
      ) {
         return reducer({}, action)
      }
      return reducer(state, action)
   }
}

export const metaReducers: MetaReducer<any>[] = [storeSyncReducer, resetUserDataReducer]

/**
 * Updates item in array if item with same id as new item exists.
 * Adds item to array if no item with same id exists.
 *
 * @param currentState
 * @param newItem
 * @returns []
 */
function updateArrayByID<T extends UniqueItem>(currentState: T[], newItem: T): T[] {
   const stateHavingObWIthID = currentState.some((item) => item.id === newItem.id)
   // if object containig id exists: update. Else just append to array
   if (stateHavingObWIthID) {
      return currentState.map((object) => (object.id === newItem.id ? { ...object, ...newItem } : object))
   } else {
      return [...currentState, newItem]
   }
}
