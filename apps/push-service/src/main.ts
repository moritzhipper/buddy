import { buddyWebpush, logger } from './tools'
import { fetchOpenNotifications, generateNotification } from './utils'

// setInterval(notify, 1000 * 60)
async function notify() {
   logger.info('Checking for open Notifications')

   const subscriptions = await fetchOpenNotifications()

   logger.info(`Found ${subscriptions.length} subscriptions`)

   if (subscriptions.length >= 1) {
      const startExecutionTime = performance.now()

      let notificationRequests = []
      for (let subscription of subscriptions) {
         const notificationObjAsString = generateNotification('Felia flieder', '14:15')
         notificationRequests.push(buddyWebpush.sendNotification(subscription.subscription, notificationObjAsString))
      }

      try {
         await Promise.all(notificationRequests)
         const executionTime = performance.now() - startExecutionTime
         logger.info(`Sent ${subscriptions.length} Notifications in ${executionTime}`)
      } catch (e) {
         logger.error(e)
      }
   }
}

// notify()
