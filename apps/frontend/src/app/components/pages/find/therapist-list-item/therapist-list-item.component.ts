import { animate, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { expandAnimation } from 'apps/frontend/src/app/animations'
import { Remindable, Therapist, ToastType } from 'apps/frontend/src/app/models'
import { InputResolveTypes, InputResolver, InputService, InputTypes } from 'apps/frontend/src/app/services/input.service'
import { ToastService } from 'apps/frontend/src/app/services/toast.service'
import { appointmentActions, therapistActions } from 'apps/frontend/src/app/store/buddy.actions'
import { selectUserProfile } from 'apps/frontend/src/app/store/buddy.selectors'
import { BuddyState } from 'apps/frontend/src/app/store/buddy.state'
import { isCurrentTimeInRange, remindableComparator } from 'apps/frontend/src/app/utiles-time'

@Component({
   selector: 'app-therapist-list-item',
   templateUrl: './therapist-list-item.component.html',
   styleUrls: ['./therapist-list-item.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
   standalone: true,
   imports: [CommonModule],
   animations: [
      expandAnimation,
      trigger('fade', [
         transition(':enter', [
            style({ opacity: 0, transform: 'translate(-28px, -28px)' }),
            animate('200ms ease-out', style({ opacity: 1, transform: 'translate(-32px, -32px)' })),
         ]),
         transition(':leave', [animate('100ms ease-in', style({ opacity: 0, transform: 'translate(-20px, -20px)' }))]),
      ]),
   ],
})
export class TherapistListItemComponent implements OnDestroy {
   @Input() therapist: Therapist

   @ViewChild('bodyOverlay') bodyOverlay: ElementRef<HTMLElement>
   @ViewChild('bodyWrapper') bodyWrapper: ElementRef<HTMLElement>

   expanded = false
   editSectionOpen = false

   private _animationTimeout = 300

   private _removeHeightAttributeTimeOut
   private _setHeightToAutoTimeOut

   private subscription
   private isFullUser = false

   constructor(
      private _renderer: Renderer2,
      public inputservice: InputService,
      private _store: Store<BuddyState>,
      private _toastService: ToastService
   ) {
      this.subscription = inject(Store)
         .select(selectUserProfile)
         .subscribe((profile) => {
            this.isFullUser = profile.isFullUser
         })
   }
   ngOnDestroy(): void {
      this.subscription.unsubscribe()
   }

   editName() {
      this.inputservice
         .openInputDialogue({
            header: 'Name bearbeiten',
            type: InputTypes.TEXT_SHORT,
            preset: this.therapist.name,
            label: 'Name',
         })
         .then((v) => this._updateValueResolve(v, 'name'))
   }

   editNote() {
      this.inputservice
         .openInputDialogue({
            header: 'Notiz',
            type: InputTypes.TEXT_LONG,
            description: 'zu ' + this.therapist.name,
            preset: this.therapist.note,
            canRemove: !!this.therapist.note,
         })
         .then((v) => this._updateValueResolve(v, 'note'))
   }

   editPhone() {
      this.inputservice
         .openInputDialogue({
            header: 'Telefonnummer angeben',
            type: InputTypes.PHONE,
            preset: this.therapist.phone,
            label: 'Nummer',
            canRemove: !!this.therapist.phone,
         })
         .then((v) => this._updateValueResolve(v, 'phone'))
   }

   editMail() {
      this.inputservice
         .openInputDialogue({
            header: 'Email angeben',
            type: InputTypes.MAIL,
            label: 'Email',
            preset: this.therapist.email,
            canRemove: !!this.therapist.email,
         })
         .then((v) => this._updateValueResolve(v, 'email'))
   }

   editFreeFrom() {
      this.inputservice
         .openInputDialogue({
            header: 'Datum angeben',
            type: InputTypes.DATE,
            description: 'ab dem ein Therapieplatz frei ist',
            preset: this.therapist.freeFrom,
            label: 'Datum',
            canRemove: !!this.therapist.freeFrom,
         })
         .then((v) => this._updateValueResolve(v, 'freeFrom'))
   }

   editCallTimes() {
      this.inputservice
         .openInputDialogue({
            header: 'Anrufzeiten ergänzen',
            type: InputTypes.CALL_TIMES,
            description: 'wann ist die Therapeut*in telefonisch erreichbar?',
            preset: this.therapist.callTimes,
            canRemove: !!this.therapist.callTimes,
         })
         .then((v) => {
            this._updateValueResolve(v, 'callTimes')
         })
   }

   editAddress() {
      this.inputservice
         .openInputDialogue({
            header: 'Adresse angeben',
            type: InputTypes.ADDRESS,
            preset: this.therapist.address,
            canRemove: !!this.therapist.address,
         })
         .then((v) => this._updateValueResolve(v, 'address'))
   }

   editTherapyTypes() {
      this.inputservice
         .openInputDialogue({
            header: 'Therapiearten angeben',
            type: InputTypes.THERAPYTYPE,
            preset: this.therapist.therapyTypes,
            canRemove: !!this.therapist.therapyTypes,
         })
         .then((v) => this._updateValueResolve(v, 'therapyTypes'))
   }

   deleteTherapist() {
      this.inputservice
         .openInputDialogue({
            header: 'Therapeut*in entfernen?',
            description: 'Du wirst die Person nicht wieder herstellen können.',
            type: InputTypes.CONFIRM,
         })
         .then((v) => {
            if (v.type === InputResolveTypes.CONFIRM) {
               this._store.dispatch(therapistActions.delete({ id: this.therapist.id }))
               this._toastService.sendToast({
                  type: ToastType.SUCCESS,
                  text: `${this.therapist.name} gelöscht`,
               })
            }
         })
   }

   toggleCallTimeReminder(index: number) {
      let updatedCallTimesArray = [...this.therapist.callTimes]
      let updatedCallTime = updatedCallTimesArray[index]

      updatedCallTime = {
         ...updatedCallTime,
         reminder: !updatedCallTime.reminder,
      }
      updatedCallTimesArray[index] = updatedCallTime

      this._updateValueResolve({ type: InputResolveTypes.CONFIRM, value: updatedCallTimesArray }, 'callTimes')
   }

   addAppointment() {
      if (this.isFullUser) {
         this.inputservice
            .openInputDialogue({
               header: 'Termin anlegen',
               type: InputTypes.APPOINTMENT,
            })
            .then((v) => v.type === InputResolveTypes.CONFIRM && this._store.dispatch(appointmentActions.create({ props: v.value })))
      } else {
         this.inputservice.openInputDialogue({
            header: 'Herzlichen Glückwunsch!',
            description: 'Du willst deinen ersten Termin anlegen? Vergebe vorher ein Passwort, um deine Profilsicherheit zu erhöhen.',
            type: InputTypes.PASSWORD,
         })
      }
   }

   private _updateValueResolve(inputResolver: InputResolver, attributeName: string) {
      if (inputResolver.type === InputResolveTypes.CONFIRM || inputResolver.type === InputResolveTypes.DELETE) {
         const therapist = { [attributeName]: inputResolver.value || null }
         this._store.dispatch(
            therapistActions.update({
               props: { ...therapist, id: this.therapist.id },
            })
         )
      }
   }

   toggleEditSectionOpen() {
      // set fixed height
      const overlayHeight = this.bodyOverlay.nativeElement.offsetHeight
      this._renderer.setStyle(this.bodyOverlay.nativeElement, 'height', overlayHeight + 'px')

      //toggle openstate
      this.editSectionOpen = !this.editSectionOpen

      //set full height
      setTimeout(() => this._setFullHeight(), 2)
   }

   toggleExpansion() {
      this.expanded = !this.expanded
   }

   reminderIsNow(): boolean {
      if (!this.therapist.callTimes) return false
      return this.therapist?.callTimes?.filter((callTime) => callTime.reminder).some(isCurrentTimeInRange)
   }

   getNextCallTime(): Remindable {
      const sorted = this.therapist?.callTimes?.filter((callTime) => callTime?.reminder).sort(remindableComparator)
      if (sorted) {
         return sorted[0]
      } else {
         return null
      }
   }

   getTherapyTypes(): string {
      return this.therapist?.therapyTypes.join(', ')
   }

   generateGoogleMapsLink() {
      const mapsBaseUrl = 'https://www.google.de/maps/place/'
      if (!this.therapist?.address) {
         return null
      } else {
         const addressString = Object.keys(this.therapist.address)
            .filter((v) => !!v)
            .map((v) => this.therapist.address[v])
            .join(' ')

         return mapsBaseUrl + encodeURI(addressString)
      }
   }

   private _appendStrings(...elements: any[]): string {
      return elements.filter((v) => !!v).join(' ')
   }

   generateAddressFooter = () =>
      [
         this._appendStrings(this.therapist?.address?.city, this.therapist?.address?.postalCode),
         this._appendStrings(this.therapist?.address?.street, this.therapist?.address?.number),
      ]
         .filter((v) => !!v)
         .join(', ')

   generateContactFooter = () => [this.therapist.phone, this.therapist.email].filter((v) => !!v).join(', ')

   private _setFullHeight() {
      const wrapperHeight = this.bodyWrapper.nativeElement.offsetHeight

      this._renderer.setStyle(this.bodyOverlay.nativeElement, 'height', wrapperHeight + 'px')
      clearTimeout(this._removeHeightAttributeTimeOut)
      this._setHeightToAutoTimeOut = setTimeout(() => {
         this._renderer.setStyle(this.bodyOverlay.nativeElement, 'height', 'auto')
      }, this._animationTimeout)
   }
}
