import { Injectable, inject } from '@angular/core'
import { SwPush } from '@angular/service-worker'
import { environment } from '../../environments/environment'
import { ToastService } from './toast.service'

@Injectable({
   providedIn: 'root',
})
export class NotificationService {
   private swPush = inject(SwPush)
   private toastService = inject(ToastService)

   private readonly VAPID_PUBLIC_KEY = environment.vapidKeyPublic

   async getPushSubscription(): Promise<PushSubscription> {
      const isAllowedToNotify = (await Notification.requestPermission()) === 'granted'

      if (!isAllowedToNotify) {
         throw new Error('Du hast benachrichtigungen nicht zugestimmt.')
      }

      try {
         const subscription = await this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
         return subscription
      } catch (e) {
         // todo log to backend here
         console.log(e)
         throw new Error('Es ist ein unerwarteter Fehler aufgetreten.')
      }
   }

   /**
    * Ignore results, because backend will stop sending notifications nevertheless as backend call removing subscription follows
    */
   async unsubscribePushSubscription(): Promise<void> {
      try {
         await this.swPush.unsubscribe()
      } catch (e) {
         // todo log to backend here
         console.log(e)
      }
   }
}
