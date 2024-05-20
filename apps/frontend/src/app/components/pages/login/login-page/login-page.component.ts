import { CommonModule } from '@angular/common'
import { Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { Auth, ToastType, UserLogin, UserProfile } from 'apps/frontend/src/app/models'
import { ToastService } from 'apps/frontend/src/app/services/toast.service'
import { authActions } from 'apps/frontend/src/app/store/buddy.actions'
import { selectAuth, selectUserProfile } from 'apps/frontend/src/app/store/buddy.selectors'
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
   private auth$ = this.store.select(selectAuth)

   profile: UserProfile
   auth: Auth
   profileExists: boolean

   private subscriptions: Subscription[] = []
   private tutorialStateWasSetOnce = false

   private router = inject(Router)

   constructor(private _toastService: ToastService) {
      this.subscriptions.push(
         this.profile$.subscribe((profile) => {
            this.profile = profile
            this.profileExists = !!profile.secret

            if (!this.tutorialStateWasSetOnce) {
               this.tutorialIsOpen = !this.profileExists
               this.tutorialStateWasSetOnce = true
            }
         }),
         this.auth$.subscribe((auth) => (this.auth = auth))
      )
   }

   ngOnDestroy(): void {
      if (this.scanner) {
         this.scanner.destroy()
      }

      this.subscriptions.forEach((s) => s.unsubscribe())
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

   loginViaCredentials(password: string) {
      let login: UserLogin = {
         password,
         secret: this.auth.secretNeedingPassword,
      }
      this.store.dispatch(authActions.login({ login, redirect: true }))
   }

   private loginViaQRKey(qrKey: string): void {
      debugger
      this.store.dispatch(authActions.login({ login: { secret: qrKey }, redirect: true }))
   }

   logOut() {
      this.store.dispatch(authActions.logout())
   }

   goToApp() {
      this.router.navigateByUrl('/find')
   }
}
