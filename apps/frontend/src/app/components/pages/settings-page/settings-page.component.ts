import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { from, switchMap, take } from 'rxjs'
import { ToastType } from '../../../models'
import { InputResolveTypes, InputService, InputTypes } from '../../../services/input.service'
import { ToastService } from '../../../services/toast.service'
import { profileActions } from '../../../store/buddy.actions'
import { selectUserProfile } from '../../../store/buddy.selectors'
import { BuddyState } from '../../../store/buddy.state'
import { vibrateWarning } from '../../../utils'
import { QrCodeComponent } from '../../shared/qr-code/qr-code.component'

export class AppSettings {
   calltimeReminderMinutesAdvance: number = 15
   appointmentReminderMinutesAdvance: number = 60
   shareDataIsEnabled: boolean = false
}

@Component({
   selector: 'app-settings-page',
   templateUrl: './settings-page.component.html',
   standalone: true,
   imports: [QrCodeComponent, CommonModule],
   styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
   userProfile$ = this._store.select(selectUserProfile)

   constructor(private _inputService: InputService, private _store: Store<BuddyState>, private _toastService: ToastService) {}

   changeCalltimeRimender(preset: number) {
      this._inputService
         .openInputDialogue({
            header: 'Anruferinnerung',
            description: 'Wie viel Zeit willst du haben, um dich auf den Anruf vorzubereiten?',
            type: InputTypes.NUMBER,
            label: 'Minuten',
            preset,
         })
         .then(
            (v) =>
               v.type === InputResolveTypes.CONFIRM &&
               this._store.dispatch(
                  profileActions.update({
                     profile: { callPrecautionTime: v.value },
                  })
               )
         )
   }

   deleteAllUserData() {
      vibrateWarning()
      this._inputService
         .openInputDialogue({
            header: 'Alle meine Daten Löschen',
            description: 'Diese Aktion wirst du nicht rückgangig machen können.',
            type: InputTypes.CONFIRM,
         })
         .then((v) => {
            if (v.type === InputResolveTypes.CONFIRM) {
               this._store.dispatch(profileActions.deleteProfile())
               this._toastService.sendToast({
                  type: ToastType.SUCCESS,
                  text: 'Deine Daten wurden erfolgreich gelöscht',
               })
            }
         })
   }

   copyToClipboard() {
      this.userProfile$
         .pipe(
            take(1),
            switchMap((userProfile) => from(navigator.clipboard.writeText(userProfile.secret)))
         )
         .subscribe(() =>
            this._toastService.sendToast({
               text: 'QR-Key in die Zwischenablage kopiert',
            })
         )
   }

   generateNewQrCode() {
      this._inputService
         .openInputDialogue({
            header: 'Neuen QR-Key generieren',
            description: 'Dieser Schritt ist nicht revidierbar.',
            type: InputTypes.CONFIRM,
         })
         .then((v) => {
            if (v.type === InputResolveTypes.CONFIRM) {
               this._store.dispatch(profileActions.rotateSecret())
            }
         })
   }

   logout() {
      this._inputService
         .openInputDialogue({
            header: 'Abmelden',
            description: 'Deine Daten sind danach weiterhin über den QR-Key abrufbar.',
            type: InputTypes.CONFIRM,
         })
         .then((v) => {
            if (v.type === InputResolveTypes.CONFIRM) {
               this._store.dispatch(profileActions.logout())
            }
         })
   }
}
