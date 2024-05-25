import { CallTime } from '@buddy/base-utils'

const weekdays = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa']

// Function to check if the current time is within the timerange
export function isCurrentTimeInRange(remindable: CallTime): boolean {
   const now = new Date()
   const currentMinutes = now.getHours() * 60 + now.getMinutes()

   const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
   }

   const fromMinutes = timeToMinutes(remindable.from)
   const toMinutes = timeToMinutes(remindable.to)

   // JavaScript's getDay(): Sunday - 0, Monday - 1, ..., Saturday - 6

   const currentDay = now.getDay()

   // Check if current day matches and time is within range
   return currentDay === weekdays.indexOf(remindable.weekday) && currentMinutes >= fromMinutes && currentMinutes <= toMinutes
}

export function callTimeToDate(remindable: CallTime): Date {
   // Weekdays starting from Sunday as '0'
   const now = new Date()

   let nextOccurrence = new Date()
   const dayIndex = weekdays.indexOf(remindable.weekday)

   // Calculate the difference between today and the target weekday
   let daysToAdd = dayIndex - now.getDay()
   // If it's the same day but the time has already passed, or if daysToAdd is negative (meaning the day has passed this week), schedule for the next week
   if (daysToAdd < 0 || (daysToAdd === 0 && nextOccurrence <= now)) {
      daysToAdd += 7
   }
   nextOccurrence.setDate(now.getDate() + daysToAdd)

   const [hours, minutes] = remindable.from.split(':').map(Number)
   nextOccurrence.setHours(hours, minutes, 0, 0)

   return nextOccurrence
}

export function remindableComparator(a: CallTime, b: CallTime): number {
   const nextOccurrenceA = callTimeToDate(a)
   const nextOccurrenceB = callTimeToDate(b)
   return nextOccurrenceA.getTime() - nextOccurrenceB.getTime()
}
