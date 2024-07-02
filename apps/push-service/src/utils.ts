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

   //------

   const timeIn15Minutes = '08:00'
   const weekday = 'mo'

   // edgecases: multiple therapists callable
   // multiple subscriptions active
   // multiple entries for the same subscription
   const dbResponse = await buddyDB.manyOrNone<{ subscription: webpush.PushSubscription }>(
      `SELECT s.subscription, ut.name AS therapist_name, ut.user_id
      FROM subscriptions s
      JOIN users_therapists ut ON s.user_id = ut.user_id
      JOIN users_call_times uct ON ut.id = uct.therapist_id
      WHERE uct."from" = $1 AND uct.weekday = $2`,
      [timeIn15Minutes, weekday]
   )

   for (let row of dbResponse) {
   }

   type NotificatableByUser = { id: string; names: string[]; subscriptions: any[] }

   // fetch all callable names per user and map them to an array
   // fetch all subscriptions per user

   // generate a TherapistNotification for every subscript
   // map those name on one instance of TherapisNotification
   // fetch all subscriptions per user
   //

   return
}

// const dbResponse = await buddyDB.manyOrNone<{ subscription: webpush.PushSubscription }>(
//    `SELECT s.subscription, ut.name AS therapist_name, ut.user_id
//    FROM subscriptions s
//    JOIN users_therapists ut ON s.user_id = ut.user_id
//    JOIN users_call_times uct ON ut.id = uct.therapist_id
//    WHERE uct.from = '08:00' AND uct.weekday = 'mo'`,
//    timeIn15Minutes
// )
