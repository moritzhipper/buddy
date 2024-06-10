import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { CallTime, Therapist } from '@buddy/base-utils'
import { Store } from '@ngrx/store'
import { WeekdaysMap } from 'apps/frontend/src/app/models'
import { selectTherapists } from 'apps/frontend/src/app/store/buddy.selectors'
import { callTimeToDate, isCurrentTimeInRange } from 'apps/frontend/src/app/utiles-time'
import { Observable, map } from 'rxjs'

type CalendarItem = {
   callTime: CallTime
   phone: string
   therapistName: string
}

@Component({
   selector: 'app-therapist-calendar',
   templateUrl: './therapist-calendar.component.html',
   styleUrl: './therapist-calendar.component.scss',
   imports: [CommonModule],
   standalone: true,
})
export class TherapistCalendarComponent {
   getFullDayName(day: string): string {
      return WeekdaysMap[day]
   }

   calendarItems$ = inject(Store)
      .select(selectTherapists)
      .pipe(map((ther) => this.flatMapToCalendarItems(ther)))

   nowCallableItems$ = this.calendarItems$.pipe(map((items) => items.filter((item) => isCurrentTimeInRange(item.callTime))))
   hasNowCallableItems$ = this.nowCallableItems$.pipe(map((items) => items?.length > 0))

   calendarItemsByDays$: Observable<{ weekday: string; items: CalendarItem[] }[]> = this.calendarItems$.pipe(
      map((calendarItems) => {
         // Predefine the weekdays to ensure all days are represented

         const weekdays = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so']

         // Reduce calendarItems into the structured array
         const structuredArray = weekdays.map((weekday) => ({
            weekday,
            items: calendarItems.filter((item) => item.callTime.weekday === weekday),
         }))

         return structuredArray.filter((item) => item.items.length !== 0)
      })
   )

   private flatMapToCalendarItems(therapists: Therapist[]): CalendarItem[] {
      const callableTherapists = therapists.filter((therapist) => therapist.callTimes)

      return callableTherapists
         .flatMap((therapist) =>
            therapist.callTimes.map((callTime) => ({
               callTime,
               phone: therapist.phone,
               therapistName: therapist.name,
            }))
         )
         .sort(this.calendarItemsComparator)
   }

   private calendarItemsComparator(a: CalendarItem, b: CalendarItem) {
      const nextOccurrenceA = callTimeToDate(a.callTime)
      const nextOccurrenceB = callTimeToDate(b.callTime)
      return nextOccurrenceA.getTime() - nextOccurrenceB.getTime()
   }
}
