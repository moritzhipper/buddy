import { PushSubscription } from 'web-push'
import { TherapistNotification, TherapistNotificationResult } from './models'
import { buddyDB, logger } from './tools'

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

export function handleFailedNotificationSends(errorList: TherapistNotificationResult[]) {
   const deadSubscriptionIDs = errorList.filter((error) => error.error.statusCode === 410).map((error) => error.subscriptionID)
   const otherErrors = errorList.filter((error) => error.error.statusCode !== 410).map((error) => error.error)

   logger.error(`Failed to send ${errorList.length} notifications.`)
   // see here: https://pushpad.xyz/blog/web-push-error-410-the-push-subscription-has-expired-or-the-user-has-unsubscribed/
   logger.error(`${deadSubscriptionIDs.length} subscriptions are expired or cancelled by user`)
   logger.error(`${otherErrors.length} subscription could not be delivered because of other errors`, otherErrors)

   removeDeadSubscriptions(deadSubscriptionIDs)
}

// todo -> wie identifiziere ich die toten subscriptions ohne alle direkt zu löschen?
export async function removeDeadSubscriptions(subscriptionIDList: string[]): Promise<void> {
   logger.info(`Deleting ${subscriptionIDList.length} dead push subscriptions`)

   try {
      const affectedRowsCount = buddyDB.result(
         'DELETE FROM subscriptions WHERE subscription_id in ($1:csv)',
         subscriptionIDList,
         (result) => result.rowCount
      )
      logger.info(`Deleted ${affectedRowsCount} dead push subscriptions`)
   } catch (e) {
      logger.error('An error occured deleting dead subscriptions')
   }
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

   const timeIn15Minutes = '00:12'
   const weekday = 'mo'

   const dbResponseRows = await buddyDB.manyOrNone<{ therapist_names: string; subscription: PushSubscription }>(
      `SELECT STRING_AGG(ut.name, ', ') AS therapist_names, s.subscription
       FROM subscriptions s
       JOIN users_therapists ut ON s.user_id = ut.user_id
       JOIN users_call_times uct ON ut.id = uct.therapist_id
       WHERE reminder = true AND uct.from = $1 AND weekday = $2
       GROUP BY s.subscription`,
      [timeIn15Minutes, weekday]
   )
   const therapistNotifications: TherapistNotification[] = dbResponseRows.map((res) => ({
      therapistNames: res.therapist_names,
      subscription: res.subscription,
      timeString: timeIn15Minutes,
   }))

   return therapistNotifications
}

export async function sendSingleNotification(therapistNotification: TherapistNotification): Promise<TherapistNotificationResult> {
   const notification = generateNotification('Felia', '12:15')

   try {
      const result = await buddyWebpush.sendNotification(therapistNotification.subscription, notification)
      return { success: true, result }
   } catch (error) {
      return { success: false, error, userID: therapistNotification.userID }
   }
}
