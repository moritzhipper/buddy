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
   constructor() {}

   swPush = inject(SwPush)
   toastService = inject(ToastService)
   backendService = inject(BackendAdapterService)

   readonly VAPID_PUBLIC_KEY = environment.vapidKeyPublic

   askPermission() {
      this.swPush
         .requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY,
         })
         .then((sub) => {
            this.backendService.addSubscription(sub)
            console.log(sub)
         })
         .catch((err) => {
            this.toastService.sendToast({
               type: ToastType.ERROR,
               text: 'Nur wenn du Benachrichtigungen erlaubst, kann die App dich an das Anrufen erinnern.',
            })
         })
      // Notification.requestPermission()
   }

   send(config: any) {
      new Notification(config.title, { body: config.body })
   }
}
