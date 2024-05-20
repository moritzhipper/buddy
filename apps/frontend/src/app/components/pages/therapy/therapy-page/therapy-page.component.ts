import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { fadeOutAnimation } from 'apps/frontend/src/app/animations'
import { Appointment, Goal } from 'apps/frontend/src/app/models'
import { InputResolveTypes, InputService, InputTypes } from 'apps/frontend/src/app/services/input.service'
import { appointmentActions, goalActions, noteActions, settingsActions } from 'apps/frontend/src/app/store/buddy.actions'
import { selectAppointments, selectGoals, selectNotes, selectSettings, selectUserProfile } from 'apps/frontend/src/app/store/buddy.selectors'
import { BuddyState } from 'apps/frontend/src/app/store/buddy.state'
import { isAppointmentInPast, remindableComparator } from 'apps/frontend/src/app/utiles-time'
import { trackById, vibrateInfo } from 'apps/frontend/src/app/utils'
import { Observable, combineLatest, filter, map } from 'rxjs'
import { NoteComponent } from '../../../shared/note-components/note/note.component'
import { PagePlaceholderTextComponent } from '../../../shared/page-placeholder-text/page-placeholder-text.component'
import { AppointmentCardComponent } from '../appointment-card/appointment-card.component'

@Component({
   selector: 'app-therapy-page',
   templateUrl: './therapy-page.component.html',
   standalone: true,
   imports: [CommonModule, PagePlaceholderTextComponent, NoteComponent, AppointmentCardComponent],
   styleUrls: ['./therapy-page.component.scss'],
   animations: [fadeOutAnimation],
})
export class TherapyPageComponent {
   trackById = trackById

   notes$ = this._store.select(selectNotes)
   hasNotes$ = this.notes$.pipe(map(this.arrayHasItems))

   goals$ = this._store.select(selectGoals)
   hasGoals$ = this.goals$.pipe(map(this.arrayHasItems))

   appointments$ = this._store.select(selectAppointments)
   hasAppointments$ = this.appointments$.pipe(map(this.arrayHasItems))

   private orderedAppointments$: Observable<Appointment[]>
   futureAppointments$: Observable<Appointment[]>
   pastAppointments$: Observable<Appointment[]>
   nextAppointment$: Observable<Appointment>

   appointmentsReminderIsOn$: Observable<boolean>
   pageIsEmpty$: Observable<boolean>
   isFullUser$: Observable<boolean>

   constructor(private _inputService: InputService, private _store: Store<BuddyState>) {
      this.appointmentsReminderIsOn$ = this._store.select(selectSettings).pipe(map((settings) => settings.remindNextAppointment))

      this.isFullUser$ = this._store.select(selectUserProfile).pipe(map((userProfile) => !!userProfile?.isFullUser))

      // hier diese ordnung einbauen
      // timeFromNowComparator
      this.orderedAppointments$ = this.appointments$.pipe(map((appointments: Appointment[]) => [...appointments].sort(remindableComparator)))

      this.futureAppointments$ = this.orderedAppointments$.pipe(map((appt) => appt.filter((appt) => !isAppointmentInPast(appt))))
      this.pastAppointments$ = this.orderedAppointments$.pipe(map((appt) => appt.filter(isAppointmentInPast)))
      this.nextAppointment$ = this.futureAppointments$.pipe(
         filter((appt) => appt?.length > 0),
         map((appt) => appt[0])
      )

      // checks if notes, topics and appointments are empty
      this.pageIsEmpty$ = combineLatest([this.notes$, this.goals$, this.appointments$]).pipe(
         map((pageDataArrays: any[]) => pageDataArrays.filter((subArray) => subArray.length != 0).length === 0)
      )
   }

   async createPassword() {
      await this._inputService.openInputDialogue({
         header: 'Passwort vergeben',
         type: InputTypes.PASSWORD,
      })
   }

   addTopic() {
      this._inputService
         .openInputDialogue({
            header: 'Thematik hinzufügen',
            type: InputTypes.TEXT_LONG,
            description: 'Halte eine Thematik fest, die du in dieser Therapie noch ansprechen möchtest',
         })
         .then((v) => v.type === InputResolveTypes.CONFIRM && this._store.dispatch(goalActions.create({ props: { body: v.value } })))
   }

   editTopic(topic: Goal) {
      this._inputService
         .openInputDialogue({
            header: 'Thematik bearbeiten',
            type: InputTypes.TEXT_LONG,
            preset: topic.body,
            canRemove: true,
         })
         .then((v) => {
            v.type === InputResolveTypes.CONFIRM && this._store.dispatch(goalActions.update({ props: { id: topic.id, body: v.value } }))
            v.type === InputResolveTypes.DELETE && this._store.dispatch(goalActions.delete({ id: topic.id }))
         })
   }

   addNote() {
      this._inputService
         .openInputDialogue({
            header: 'Notiz anlegen',
            type: InputTypes.TEXT_LONG,
            description: 'zum Beispiel zu einer Sitzung oder einem Ereignis',
         })
         .then((v) => v.type === InputResolveTypes.CONFIRM && this._store.dispatch(noteActions.create({ props: { body: v.value } })))
   }

   addSessionDate() {
      this._inputService
         .openInputDialogue({
            header: 'Termin hinzufügen',
            type: InputTypes.APPOINTMENT,
         })
         .then((v) => v.type === InputResolveTypes.CONFIRM && this._store.dispatch(appointmentActions.create({ props: v.value })))
   }

   toggleReminder() {
      this._store.dispatch(settingsActions.toggleAppointment())
      vibrateInfo()
   }

   private arrayHasItems<T>(array: T[]): boolean {
      return array?.length > 0
   }
}
