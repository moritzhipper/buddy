import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap } from 'rxjs'
import { BackendAdapterService } from '../../services/backend-adapter.service'
import { NotificationService } from '../../services/notification.service'
import { errorToastAction, httpErrorAction, localConfigActions } from '../buddy.actions'

@Injectable()
export class LocalConfigEffects {
   actions$ = inject(Actions)
   notificationService = inject(NotificationService)
   backendAdapter = inject(BackendAdapterService)

   verifyNotificationPermission$ = createEffect(() =>
      this.actions$.pipe(
         ofType(localConfigActions.verifyNotificationsPermission),
         switchMap(() => this.notificationService.setupPushSubscriptions()),
         switchMap((pushSubscription) => {
            if (pushSubscription) {
               return this.backendAdapter.addSubscription(pushSubscription).pipe(
                  map(() => localConfigActions.notificationVerificationSuccessfull()),
                  catchError((error) => of(httpErrorAction({ error })))
               )
            } else {
               return of(errorToastAction({ message: `Lese unter 'Infos' nach, wie du Benachrichtigungen aktivierst.` }))
            }
         })
      )
   )

   removeNotificationPermission$ = createEffect(() =>
      this.actions$.pipe(
         ofType(localConfigActions.removeNotificationPermission),
         switchMap(() => {
            return this.backendAdapter.removeSubscription().pipe(
               map(() => localConfigActions.notificationRemovalSuccessfull()),
               catchError((error) => of(httpErrorAction({ error })))
            )
         })
      )
   )
}
