import { CommonModule } from '@angular/common'
import { Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core'
import { Router } from '@angular/router'
import { UserProfile } from '@buddy/base-utils'
import { Store } from '@ngrx/store'
import { ToastType } from 'apps/frontend/src/app/models'
import { ToastService } from 'apps/frontend/src/app/services/toast.service'
import { profileActions } from 'apps/frontend/src/app/store/buddy.actions'
import { selectUserProfile } from 'apps/frontend/src/app/store/buddy.selectors'
import { BuddyState } from 'apps/frontend/src/app/store/buddy.state'
import QrScanner from 'qr-scanner'
import { Subscription } from 'rxjs'
import { TutorialWrapperComponent } from '../tutorial-wrapper/tutorial-wrapper.component'

@Component({
   selector: 'app-login-page',
   templateUrl: './login-page.component.html',
   styleUrls: ['./login-page.component.scss'],
   standalone: true,
   imports: [CommonModule, TutorialWrapperComponent],
})
export class LoginPageComponent implements OnDestroy {
   @ViewChild('webcamPreview', { static: false })
   webcamPreview: ElementRef<HTMLVideoElement>

   // all of those 4 menues can create a session
   tutorialIsOpen = false
   scannerIsOpen = false
   screenshotSelectorIsOpen = false
   qrKeyInputIsOpen = false

   scanner: QrScanner

   private store = inject(Store<BuddyState>)
   private profile$ = this.store.select(selectUserProfile)

   profile: UserProfile
   profileExists: boolean

   private subscription: Subscription
   private tutorialStateWasSetOnce = false

   private router = inject(Router)

   constructor(private _toastService: ToastService) {
      this.subscription = this.profile$.subscribe((profile) => {
         this.profile = profile
         this.profileExists = !!profile.secret

         if (!this.tutorialStateWasSetOnce) {
            this.tutorialIsOpen = !this.profileExists
            this.tutorialStateWasSetOnce = true
         }
      })
   }

   ngOnDestroy(): void {
      if (this.scanner) {
         this.scanner.destroy()
      }

      this.subscription.unsubscribe()
   }

   allLoginOptionsClosed() {
      return !(this.scannerIsOpen || this.screenshotSelectorIsOpen || this.qrKeyInputIsOpen)
   }

   toggleTutorial() {
      this.toggleScanner(false)
      this.screenshotSelectorIsOpen = false
      this.qrKeyInputIsOpen = false
      this.tutorialIsOpen = !this.tutorialIsOpen
   }

   useTextToLogin(key: string) {
      this.loginViaQRKey(key)
   }

   toggleScanner(setOpen?: boolean) {
      this.scannerIsOpen = setOpen !== undefined ? setOpen : !this.scannerIsOpen

      if (this.scannerIsOpen) {
         setTimeout(() => {
            this.scanner = new QrScanner(this.webcamPreview.nativeElement, (v) => this.resolveScan(v), { preferredCamera: 'environment' })
            this.scanner.start()
         }, 0)
      } else if (this.scanner) {
         this.scanner.destroy()
      }
   }

   resolveScan(result: any) {
      this.loginViaQRKey(result.data)
      setTimeout(() => this.toggleScanner(false), 100)
   }

   resolveScreenshot(image: File) {
      QrScanner.scanImage(image, {})
         .then((result) => {
            // typings say result has attribute data. Reality says it does not.
            this.loginViaQRKey(result as undefined as string)
         })
         .catch(() => {
            this._toastService.sendToast({
               text: 'QR-Key konnte nicht erkannt werden. Versuche es bitte erneut',
               type: ToastType.ERROR,
            })
         })
   }

   private loginViaQRKey(qrKey: string): void {
      this.store.dispatch(profileActions.loadProfile({ secret: qrKey }))
   }

   logOut() {
      this.store.dispatch(profileActions.logout())
   }

   goToApp() {
      this.router.navigateByUrl('/find')
   }
}
