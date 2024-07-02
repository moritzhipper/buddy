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

   async verifyBrowserPermissions(): Promise<boolean> {
      const pwaIsNotInstalled = !this.pwaIsInstalled()
      await Notification.requestPermission()

      if (pwaIsNotInstalled) {
         this.toastService.sendToast({
            type: ToastType.ERROR,
            text: `Installiere die App, um Benachrichtigungen zu erhalten. Lese dies unter 'Infos' nach`,
         })
         return false
      } else if (Notification.permission === 'denied') {
         this.toastService.sendToast({
            type: ToastType.ERROR,
            text: `Du hast Benachrichtigungen deaktiviert. Lese unter 'Info' nach, wie du sie wieder aktivieren kannst.`,
         })
         return false
      }

      return true
   }

   async getSubscriptionFromBrowser(): Promise<PushSubscription> {
      const browserIsSetupCorrectly = await this.verifyBrowserPermissions()

      if (!browserIsSetupCorrectly) throw Error('')

      const pushSubscription = await this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })

      if (!pushSubscription) throw Error()

      return pushSubscription
   }

   private pwaIsInstalled() {
      return window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && navigator.standalone === true)
   }
}
