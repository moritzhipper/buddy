import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, tap } from 'rxjs/operators'
import { ToastType } from '../../models'
import { ToastService } from '../../services/toast.service'
import { errorToastAction, httpErrorAction, profileActions } from '../buddy.actions'

@Injectable()
export class StateSyncEffects {
   private toastService = inject(ToastService)
   private actions$ = inject(Actions)
   private router = inject(Router)

   handleHTTPError$ = createEffect(() =>
      this.actions$.pipe(
         ofType(httpErrorAction),
         map((action) => {
            if (action.error.status === 401) {
               this.toastService.sendToast({
                  type: ToastType.ERROR,
                  text: 'Dein QR-Key wurde nicht gefunden.',
               })

               return profileActions.logout()
            } else {
               return errorToastAction({ message: 'Es ist ein Fehler aufgetreten. Versuche es später erneut.' })
            }
         })
      )
   )

   errorToast$ = createEffect(
      () =>
         this.actions$.pipe(
            ofType(errorToastAction),
            tap(() => {
               this.toastService.sendToast({
                  type: ToastType.ERROR,
                  text: 'Es ist ein Fehler aufgetreten. Versuche es später erneut.',
               })
            })
         ),
      { dispatch: false }
   )

   goToLogin = createEffect(
      () =>
         this.actions$.pipe(
            ofType(profileActions.logout),
            tap(() => {
               this.router.navigateByUrl('/login')
            })
         ),
      { dispatch: false }
   )
}
