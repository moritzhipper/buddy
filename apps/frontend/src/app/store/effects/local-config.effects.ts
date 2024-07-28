import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, startWith, switchMap, tap } from 'rxjs'
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
         switchMap(() => this.notificationService.getPushSubscription()),
         switchMap((pushSubscription) =>
            this.backendAdapter.addSubscription(pushSubscription).pipe(
               map(() => localConfigActions.notificationVerificationSuccessfull()),
               catchError((error) => of(httpErrorAction({ error })))
            )
         ),
         catchError((e, source) => source.pipe(startWith(errorToastAction({ message: e.message }))))
      )
   )

   removeNotificationPermission$ = createEffect(
      () =>
         this.actions$.pipe(
            ofType(localConfigActions.removeNotificationPermission),
            tap(() => this.notificationService.unsubscribePushSubscription())
         ),
      { dispatch: false }
   )
}
