import { Injectable, inject } from '@angular/core'
import { SwPush } from '@angular/service-worker'
import { ToastType } from '../models'
import { ToastService } from './toast.service'
import { BackendAdapterService } from './backend-adapter.service'

@Injectable({
   providedIn: 'root',
})
export class NotificationService {
   constructor() {}

   swPush = inject(SwPush)
   toastService = inject(ToastService)
   backendService = inject(BackendAdapterService)

   readonly VAPID_PUBLIC_KEY = 'BBZYBgvEegKC57oonu8SiZ64A0Xq3MktHLTgs7oJYaw2iQ7j5Qa_TVaHTrmS3gXGIn_lRtq0BJopaEIpu0755ao'

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
      Notification.requestPermission()
   }

   send(config: any) {
      new Notification(config.title, { body: config.body })
   }
}
