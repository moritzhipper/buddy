import { environment } from '@buddy/base-utils'
import pgPromise from 'pg-promise'
import webpush from 'web-push'

const pgp = pgPromise()
const buddyConnection = `postgres://${environment.dbUser}:${environment.dbPW}@${environment.host}:${environment.dbPort}/buddy`
const buddyDB = pgp(buddyConnection)

// setInterval(notify, 1000 * 60)
const vapidKeys = {
   publicKey: 'BBZYBgvEegKC57oonu8SiZ64A0Xq3MktHLTgs7oJYaw2iQ7j5Qa_TVaHTrmS3gXGIn_lRtq0BJopaEIpu0755ao',
   privateKey: 'QD71gGi7PZlv-HHGQK-HSWbMCXsUNOt2Sb9dV9C93OU',
}

webpush.setVapidDetails('https://localhost:4200/list', vapidKeys.publicKey, vapidKeys.privateKey)

const notificationPayload = async function notify() {
   console.log('Checkin')
   const subscriptions = await buddyDB.manyOrNone<{ subscription: webpush.PushSubscription }>('SELECT subscription FROM subscriptions')

   console.log(`found ${subscriptions.length} subscriptions`)

   if (subscriptions.length >= 1) {
      let notificationRequests = []
      for (let subscription of subscriptions) {
         console.log(subscription)
         notificationRequests.push(webpush.sendNotification(subscription.subscription, JSON.stringify(notificationPayload)))
      }

      Promise.all(notificationRequests)
         .then(() => {
            console.log('success')
         })
         .catch((err) => {
            console.log(err)
         })
   }
}

notify()

function generateNotificationBody(therapistName: string, timeString: string) {
   return {
      notification: {
         title: 'Es ist so weit',
         body: `...um ${timeString}h kannst du ${therapistName} anrufen`,
         icon: 'no',
         vibrate: [50, 50, 50],
         data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
         },
         actions: [
            {
               action: 'explore',
               title: 'Go to the site',
            },
         ],
      },
   }
}
