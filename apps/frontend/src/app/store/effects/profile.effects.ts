import { Injectable, inject } from '@angular/core'
import { BuddyRoutes, UserProfile } from '@buddy/base-utils'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap } from 'rxjs'
import { BackendAdapterService } from '../../services/backend-adapter.service'
import { httpErrorAction, profileActions } from '../buddy.actions'

@Injectable()
export class ProfileEffects {
   actions$ = inject(Actions)
   backendAdapter = inject(BackendAdapterService)

   createProfile$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.createProfile),
         switchMap(() =>
            this.backendAdapter.createProfile().pipe(
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
               map((secret) => profileActions.updateSuccess({ profile: { ...secret } })),
               catchError((error) => of(httpErrorAction({ error })))
            )
         )
      )
   )

   updateProfile$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.update),
         switchMap((action) =>
            this.backendAdapter.updateProfile(action.profile).pipe(
               map((profile) => profileActions.updateSuccess({ profile })),
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
            this.backendAdapter.get<UserProfile>(BuddyRoutes.PROFILE + `/${action.secret}`).pipe(
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
