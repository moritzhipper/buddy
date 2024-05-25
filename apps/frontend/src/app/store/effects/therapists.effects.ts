import { Injectable, inject } from '@angular/core'
import { Therapist } from '@buddy/base-utils'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap } from 'rxjs'
import { BackendAdapterService } from '../../services/backend-adapter.service'
import { httpErrorAction, profileActions, therapistActions } from '../buddy.actions'

@Injectable()
export class TherapistsEffects {
   private backendAdapter = inject(BackendAdapterService)
   private actions$ = inject(Actions)
   route = '/therapists'

   addTherapist$ = createEffect(() =>
      this.actions$.pipe(
         ofType(therapistActions.create),
         switchMap((action) =>
            this.backendAdapter.postUniqueItem(action.props, this.route).pipe(
               map((therapist) => therapistActions.save({ props: therapist })),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )

   readOnLoginTherapist$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.loadProfileSuccess),
         switchMap(() =>
            this.backendAdapter.get<Therapist[]>(this.route).pipe(
               map((therapists) => therapistActions.saveMany({ props: therapists })),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )

   updateTherapist$ = createEffect(() =>
      this.actions$.pipe(
         ofType(therapistActions.update),
         switchMap((action) =>
            this.backendAdapter.patchTherapist(action.props, this.route).pipe(
               map((therapist) => therapistActions.save({ props: therapist })),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )

   deleteTherapist$ = createEffect(() =>
      this.actions$.pipe(
         ofType(therapistActions.delete),
         switchMap((action) =>
            this.backendAdapter.deleteUniqueItem(action.id, this.route).pipe(
               map((id) => therapistActions.deleteSuccess({ id })),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )
}
