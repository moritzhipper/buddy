import { Injectable, inject } from '@angular/core'
import { SwPush } from '@angular/service-worker'
import { environment } from '../../environments/environment'
import { ToastType } from '../models'
import { BackendAdapterService } from './backend-adapter.service'
import { ToastService } from './toast.service'

@Injectable({
   providedIn: 'root',
})
export class NotificationService {
   private swPush = inject(SwPush)
   private toastService = inject(ToastService)
   private backendService = inject(BackendAdapterService)

   private readonly VAPID_PUBLIC_KEY = environment.vapidKeyPublic

   private async generateSubscription() {
      console.log('hi')
      try {
         const subscription = await this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
         this.backendService.addSubscription(subscription)
      } catch (e) {
         this.toastService.sendToast({
            type: ToastType.ERROR,
            text: 'Du kannst nur an Anrufzeiten erinnert werden, wenn du Benachrichtigungen erlaubst.',
         })
      }
   }

   /**
    * Does nothing if user already gave permission. Asks for permission if user did not make a decision yet.
    */
   async verifySubscriptionExists() {
      console.log('helloooo')
      const isNotInstalled = !this.pwaIsInstalled()
      const permissionstatus = await navigator.permissions.query({ name: 'notifications' })

      if (isNotInstalled) {
         this.toastService.sendToast({
            type: ToastType.ERROR,
            text: 'Installiere die App, um Benachrichtigungen zu erhalten. Lese dies unter Informationen nach',
         })
      } else if (permissionstatus.state === 'denied') {
         this.toastService.sendToast({
            type: ToastType.ERROR,
            text: 'Du hast Benachrichtigungen deaktiviert. Lese unter Info nach, wie du sie wieder aktivieren kannst.',
         })
      } else if (permissionstatus.state === 'prompt' || permissionstatus.state === 'granted') {
         // send subscription to bakend
         // if already existing, it is updated, if not it is created saved
         // because we can not know if it exists or not withou sending it to backend, it is saved everytime
         // we are ultra secure here because notification are a core functionality
         await this.generateSubscription()
      }
   }

   private pwaIsInstalled() {
      return window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && navigator.standalone === true)
   }
}
