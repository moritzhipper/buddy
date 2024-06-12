import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { catchError, map, of, switchMap, take } from 'rxjs'
import { BackendAdapterService } from '../../services/backend-adapter.service'
import { httpErrorAction, searchActions } from '../buddy.actions'
import { selectSearch } from '../buddy.selectors'

@Injectable()
export class SearchEffects {
   actions$ = inject(Actions)
   backendAdapter = inject(BackendAdapterService)
   searchState$ = inject(Store)
      .select(selectSearch)
      .pipe(map((searchState) => searchState.parameters))

   fetchResultsSave$ = createEffect(() =>
      this.actions$.pipe(
         ofType(searchActions.saveSearch),
         map(() => searchActions.fetchSearchResults())
      )
   )

   fetchResults$ = createEffect(() =>
      this.actions$.pipe(
         ofType(searchActions.fetchSearchResults),
         switchMap(() => this.searchState$.pipe(take(1))),
         switchMap((parameters) => {
            // reset search if all values are undefined
            const valuesInRequest = Object.values(parameters)
               .map(Boolean)
               .some((v) => v === true)

            if (valuesInRequest) {
               return this.backendAdapter.searchTherapists(parameters).pipe(
                  map((results) => searchActions.saveSearchResults({ results })),
                  catchError((error) => of(httpErrorAction({ error })))
               )
            } else {
               return of(searchActions.resetFilter())
            }
         })
      )
   )
}
