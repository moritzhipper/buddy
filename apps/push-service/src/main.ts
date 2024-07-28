import { logger } from './tools'
import { fetchOpenNotifications, handleFailedNotificationSends, sendSingleNotification } from './utils'

// setInterval(notify, 1000 * 60)

async function notify() {
   logger.info('Checking for open Notifications')

   const therapistNotifications = await fetchOpenNotifications()

   logger.info(`Found ${therapistNotifications.length} open notifications`)

   try {
      const results = await Promise.all(therapistNotifications.map(sendSingleNotification))
      const successful = results.filter((result) => result.success)
      const failed = results.filter((results) => !results.success)

      console.log(`Successfully sent ${successful.length} Notifications`)

      if (failed.length > 0) {
         handleFailedNotificationSends(failed)
      }
   } catch (error) {
      console.error('Error occured while trying to notify users of call times', error)
   }
}

// notify()
