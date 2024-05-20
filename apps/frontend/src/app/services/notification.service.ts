import { Injectable } from '@angular/core'
import { Appointment, Therapist } from '../models'

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
