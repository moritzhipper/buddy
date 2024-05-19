import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Observable, Subject } from 'rxjs';
import { Appointment, Settings, Therapist } from '../models';
import {
   selectAppointments,
   selectSettings,
   selectTherapists,
} from '../store/buddy.selectors';
import { BuddyState } from '../store/buddy.state';
import { NotificationService } from './notification.service';

@Injectable({
   providedIn: 'root',
})
export class NotificationSchedulerService {
   // todo refactor this const, maybe use angulars weekdays Enum
   private _weekdays = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];

   TIME_INTERVAL_CHECK: number = 10000;
   interval$ = interval(this.TIME_INTERVAL_CHECK);

   appointments$: Observable<Appointment[]> =
      this._store.select(selectAppointments);
   therapists$: Observable<Therapist[]> = this._store.select(selectTherapists);
   settings$: Observable<Settings> = this._store.select(selectSettings);

   notificationSubject = new Subject();

   appointmentsScheduler$;
   therapistsScheduler$;

   notifyables = new Set();
   notifyablesOld = new Set();

   constructor(
      private _store: Store<BuddyState>,
      private _notificationService: NotificationService
   ) {
      this.notificationSubject.subscribe((v: string) => {
         this.notifyables.add(v);

         //neues notifyen -warnung
         // notify notifyables - notifyables old;

         //altes notifyen -> Jetzt  Gehts Los
         // notify notifyables

         this._notificationService.send(v);
      });
   }

   turnOnNotifications() {
      this.appointmentsScheduler$.subscribe();
      this.therapistsScheduler$.subscribe();
   }

   turnOffNotifications() {
      this.appointmentsScheduler$.unsubscribe();
      this.therapistsScheduler$.unsubscribe();
   }
}
