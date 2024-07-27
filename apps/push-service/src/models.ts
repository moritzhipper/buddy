import { PushSubscription, SendResult, WebPushError } from 'web-push'

export type TherapistNotification = {
   subscription: PushSubscription
   timeString: string
   therapistNames: string
   userID: string
}

export type TherapistNotificationResult = {
   success: boolean
   userID?: string
   error?: WebPushError
   result?: SendResult
}
