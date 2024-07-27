import { PushSubscription, SendResult, WebPushError } from 'web-push'

export type TherapistNotification = {
   subscription: PushSubscription
   timeString: string
   therapistNames: string
}

export type TherapistNotificationResult = {
   success: boolean
   subscriptionID?: string
   error?: WebPushError
   result?: SendResult
}
