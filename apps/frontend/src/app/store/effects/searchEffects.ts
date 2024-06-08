import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap } from 'rxjs'
import { BackendAdapterService } from '../../services/backend-adapter.service'
import { httpErrorAction, searchActions } from '../buddy.actions'

@Injectable()
export class SearchEffects {
   actions$ = inject(Actions)
   backendAdapter = inject(BackendAdapterService)

   addTherapist$ = createEffect(() =>
      this.actions$.pipe(
         ofType(searchActions.saveSearch),
         switchMap((action) =>
            this.backendAdapter.searchTherapists(action.props).pipe(
               map((results) => searchActions.saveSearchResults({ results })),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )
}
