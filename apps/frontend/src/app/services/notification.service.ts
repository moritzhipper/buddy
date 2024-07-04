import { Injectable, inject } from '@angular/core'
import { SwPush } from '@angular/service-worker'
import { environment } from '../../environments/environment'
import { ToastType } from '../models'
import { ToastService } from './toast.service'

@Injectable({
   providedIn: 'root',
})
export class NotificationService {
   private swPush = inject(SwPush)
   private toastService = inject(ToastService)

   private readonly VAPID_PUBLIC_KEY = environment.vapidKeyPublic

   async setupPushSubscriptions(): Promise<PushSubscription> {
      const isAllowedToNotify = await this.notificationPermissionIsGiven()
      const isInstalled = this.pwaIsInstalled()

      if (isAllowedToNotify && isInstalled) {
         return await this.getSubscriptionFrombrowser()
      } else {
         return undefined
      }
   }

   private async getSubscriptionFrombrowser(): Promise<PushSubscription> {
      try {
         return await this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
      } catch (e) {
         // todo log to backend here
         console.log('Error getting subscription from Browser even though user permitted it')
         return undefined
      }
   }

   private async notificationPermissionIsGiven(): Promise<boolean> {
      await Notification.requestPermission()

      if (Notification.permission === 'denied') {
         this.toastService.sendToast({
            type: ToastType.ERROR,
            text: `Du hast Benachrichtigungen noch nicht zugestimmt.`,
         })
         return false
      }

      return true
   }

   private pwaIsInstalled(): boolean {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && navigator.standalone === true)

      if (!isInstalled) {
         this.toastService.sendToast({
            type: ToastType.ERROR,
            text: `Die App ist noch nicht installiert.`,
         })
         return false
      }

      return true
   }
}
