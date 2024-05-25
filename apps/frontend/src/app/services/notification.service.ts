import { Injectable } from '@angular/core'

@Injectable({
   providedIn: 'root',
})
export class NotificationService {
   constructor() {}

   askPermission() {
      Notification.requestPermission()
   }

   send(config: any) {
      new Notification(config.title, { body: config.body })
   }
}
