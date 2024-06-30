import webpush from 'web-push'
import { buddyDB } from './tools'

export function generateNotification(therapistName: string, timeString: string): string {
   const notificationObject = {
      notification: {
         title: 'Es ist so weit',
         body: `...um ${timeString}h kannst du ${therapistName} anrufen`,
         icon: 'TODO',
         vibrate: [50, 50, 50],
         data: {
            onActionClick: {
               default: { operation: 'navigateLastFocusedOrOpen', url: '/list' },
            },
         },
         actions: [
            {
               action: 'default',
               title: 'Buddy öffnen',
            },
         ],
      },
   }

   return JSON.stringify(notificationObject)
}

export type TherapistNotification = {
   subscription: webpush.PushSubscription
   timeString: string
   therapistNames: string[]
}

/**
 * Fetches all Therapists of users who
 *  - have notifications enabled on at least one device
 *  - have therapists saved in their list which are callable in exactly 15 minutes
 */
export async function fetchOpenNotifications(): Promise<TherapistNotification[]> {
   // generiere zeitstring aus aktuelles zeit + 15min wie 15:15
   // ziehe userIDS von usern, die eine subscription haben
   // ziehe therapeuten, die den zeitstring haben
   // schicke notifications
   return await buddyDB.manyOrNone<{ subscription: webpush.PushSubscription }>('SELECT subscription FROM subscriptions')
}
