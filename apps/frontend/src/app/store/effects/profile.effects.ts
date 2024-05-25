import { Injectable, inject } from '@angular/core'
import { UserProfile } from '@buddy/base-utils'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap } from 'rxjs'
import { BackendAdapterService } from '../../services/backend-adapter.service'
import { httpErrorAction, profileActions } from '../buddy.actions'

@Injectable()
export class ProfileEffects {
   actions$ = inject(Actions)
   backendAdapter = inject(BackendAdapterService)
   private routeUser = this.backendAdapter.ROUTE_USER_PROFILE

   createProfile$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.createProfile),
         switchMap(() =>
            this.backendAdapter.post<UserProfile>(this.routeUser, null).pipe(
               map((profile) => profileActions.createProfileSuccess({ profile })),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )

   rotateSecret$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.rotateSecret),
         switchMap(() =>
            this.backendAdapter.rotateQRkey().pipe(
               map((secret) => profileActions.rotateSecretSuccess(secret)),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )

   // fetch missing email or secret after login
   loadProfile = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.loadProfile),
         switchMap((action) =>
            this.backendAdapter.get<UserProfile>(this.backendAdapter.ROUTE_USER_PROFILE + `/${action.secret}`).pipe(
               map((profile) => profileActions.loadProfileSuccess({ profile: { secret: action.secret, ...profile } })),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )

   resetUserDataBackend$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.deleteProfile),
         switchMap(() =>
            this.backendAdapter.deleteProfile().pipe(
               map(() => profileActions.deleteProfileSuccess()),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )
}
