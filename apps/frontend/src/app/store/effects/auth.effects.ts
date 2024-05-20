import { HttpErrorResponse } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators'
import { BackendAdapterService } from '../../services/backend-adapter.service'
import { authActions, httpErrorActions, profileActions } from '../buddy.actions'

@Injectable()
export class AuthEffects {
   private actions$ = inject(Actions)
   private backendAdapter = inject(BackendAdapterService)
   private router = inject(Router)

   login$ = createEffect(() =>
      this.actions$.pipe(
         ofType(authActions.login),
         switchMap((action) =>
            this.backendAdapter.createSession(action.login).pipe(
               map((res) =>
                  authActions.loginSuccess({
                     session: res.session,
                     redirect: action.redirect,
                  })
               ),
               catchError((error: HttpErrorResponse) => {
                  const is401 = error?.status === 401
                  const userNeedsToProvidePassword = error?.error?.message.includes('Bitte gib')

                  if (is401 && userNeedsToProvidePassword) {
                     return of(
                        authActions.requestPassword({
                           secret: action.login.secret,
                        })
                     )
                  } else {
                     return of(httpErrorActions.handle({ error }))
                  }
               })
            )
         )
      )
   )

   // enable logout regardless of session validity. Ignore errors on logout api call
   logout$ = createEffect(() =>
      this.actions$.pipe(
         ofType(authActions.logout),
         switchMap(() =>
            this.backendAdapter.logout().pipe(
               map(() => authActions.logoutSuccess()),
               catchError((e) => of(authActions.logoutSuccess()))
            )
         )
      )
   )

   goToFind = createEffect(
      () =>
         this.actions$.pipe(
            ofType(authActions.loginSuccess),
            filter((action) => action.redirect),
            tap(() => {
               this.router.navigateByUrl('/find')
            })
         ),
      { dispatch: false }
   )

   goToLogin = createEffect(
      () =>
         this.actions$.pipe(
            ofType(
               authActions.logoutSuccess,
               profileActions.profileNotExisting,
               profileActions.deleteProfileSuccess,
               authActions.handleInvalidSession,
               authActions.requestPassword
            ),
            tap(() => {
               this.router.navigateByUrl('/login')
            })
         ),
      { dispatch: false }
   )
}
