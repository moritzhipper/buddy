import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
   authActions,
   httpErrorActions,
   profileActions,
} from '../buddy.actions';
import { UserProfile } from '../../models';
import { BackendAdapterService } from '../../services/backend-adapter.service';

@Injectable()
export class ProfileEffects {
   actions$ = inject(Actions);
   backendAdapter = inject(BackendAdapterService);
   private routeUser = this.backendAdapter.ROUTE_USER_PROFILE;
   private routeAuth = this.backendAdapter.ROUTE_AUTH;

   createSecret$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.createSecret),
         switchMap(() =>
            this.backendAdapter
               .post<{ secret: string }>(this.routeUser, null)
               .pipe(
                  map((res) =>
                     profileActions.createSecretSuccess({
                        login: { secret: res.secret },
                     })
                  ),
                  catchError((error) => of(httpErrorActions.handle({ error })))
               )
         )
      )
   );

   createCredentialsSuccess$ = createEffect(() =>
      this.actions$.pipe(
         ofType(
            profileActions.createCredentialsSuccess,
            profileActions.createSecretSuccess
         ),
         map((action) => authActions.login({ login: action.login }))
      )
   );

   // upgrade profile using UserLogin, login, add session to store
   createCredentials$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.createCredentials),
         switchMap((action) =>
            this.backendAdapter
               .post(this.routeAuth + '/cred', action.login)
               .pipe(
                  map(() =>
                     profileActions.createCredentialsSuccess({
                        login: action.login,
                     })
                  ),
                  catchError((error) => of(httpErrorActions.handle({ error })))
               )
         )
      )
   );

   rotateSecret$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.rotateSecret),
         switchMap(() =>
            this.backendAdapter.rotateQRkey().pipe(
               map((res) =>
                  authActions.login({ login: { secret: res.secret } })
               ),
               catchError((error) => of(httpErrorActions.handle({ error })))
            )
         )
      )
   );

   // fetch missing email or secret after login
   loadProfileInfoAfterLogin = createEffect(() =>
      this.actions$.pipe(
         ofType(authActions.loginSuccess),
         switchMap(() =>
            this.backendAdapter
               .get<UserProfile>(this.backendAdapter.ROUTE_USER_PROFILE)
               .pipe(
                  map((profile) => profileActions.saveCredentials({ profile })),
                  catchError((error) => of(httpErrorActions.handle({ error })))
               )
         )
      )
   );

   resetUserDataBackend$ = createEffect(() =>
      this.actions$.pipe(
         ofType(profileActions.deleteProfile),
         switchMap(() =>
            this.backendAdapter.resetUserData().pipe(
               map(() => profileActions.deleteProfileSuccess()),
               catchError((error) => of(httpErrorActions.handle({ error })))
            )
         )
      )
   );
}
