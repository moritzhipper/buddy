import { UniqueItem } from '@buddy/base-utils'
import { ActionReducer, createReducer, INIT, MetaReducer, on, UPDATE } from '@ngrx/store'
import { profileActions, searchActions, therapistActions } from './buddy.actions'
import { SearchState } from './buddy.state'

export const therapistsReducer = createReducer(
   [],
   on(therapistActions.save, (state, { props }) => updateArrayByID(state, props)),
   on(therapistActions.saveMany, (state, { props }) => props),
   on(therapistActions.deleteSuccess, (state, { id }) => state.filter((item) => item.id !== id))
)

export const profileReducer = createReducer(
   {},
   on(profileActions.createProfileSuccess, profileActions.loadProfileSuccess, (state, { profile }) => profile),
   on(profileActions.updateSuccess, (state, { profile }) => ({ ...state, ...profile }))
)

export const searchReducer = createReducer(
   {} as SearchState,
   on(searchActions.saveSearch, (state, { props }) => ({ ...state, ...{ parameters: { ...state.parameters, ...props } } })),
   on(searchActions.saveSearchResults, (state, { results }) => ({ ...state, ...{ results } })),
   on(searchActions.resetFilter, () => ({}))
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
      if (action.type === profileActions.logout.type || action.type === profileActions.deleteProfileSuccess.type) {
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
