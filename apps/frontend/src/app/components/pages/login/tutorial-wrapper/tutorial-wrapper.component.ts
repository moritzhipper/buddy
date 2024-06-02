import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Store } from '@ngrx/store'
import { profileActions } from 'apps/frontend/src/app/store/buddy.actions'
import { selectUserProfile } from 'apps/frontend/src/app/store/buddy.selectors'
import { BuddyState } from 'apps/frontend/src/app/store/buddy.state'
import { Subscription } from 'rxjs'
import { QrCodeComponent } from '../../../shared/qr-code/qr-code.component'

@Component({
   selector: 'app-tutorial-wrapper',
   templateUrl: './tutorial-wrapper.component.html',
   styleUrls: ['./tutorial-wrapper.component.scss'],
   standalone: true,
   imports: [CommonModule, QrCodeComponent, RouterModule],
   animations: [
      trigger('flyInList', [
         transition('* => *', [
            group([
               query(
                  '.page-element-wrapper:enter',
                  [
                     style({ opacity: 0, transform: 'translateY(10px)' }),
                     stagger(-200, [animate('600ms 200ms ease', style({ opacity: 1, transform: 'translateY(0)' }))]),
                  ],
                  { optional: true }
               ),
            ]),
         ]),
      ]),
      trigger('fadeInOut', [
         transition(':leave', [
            style({ opacity: 1, transform: 'scale(1)' }),
            animate('200ms ease-in-out', style({ opacity: 0, transform: 'scale(1.05)' })),
         ]),
      ]),
   ],
})
export class TutorialWrapperComponent implements OnInit, OnDestroy {
   private store = inject(Store<BuddyState>)
   private subscription: Subscription
   hasQRKey: boolean = false
   router = inject(Router)

   activePage = 0
   pagesCount = 6
   userIsAllowedToGoToNextPage = () => [0, 1, 2, 3].includes(this.activePage) || (this.activePage === 4 && this.hasQRKey)
   userIsOnLastPage = () => this.activePage === this.pagesCount - 1
   userNeedsToAcceptDataprivacy = () => this.activePage === 4 && !this.hasQRKey

   ngOnInit(): void {
      this.subscription = this.store.select(selectUserProfile).subscribe((profile) => (this.hasQRKey = !!profile.secret))
   }

   ngOnDestroy(): void {
      this.subscription.unsubscribe()
   }

   constructor() {}

   goToLastPage() {
      this.activePage !== 0 && this.activePage--
   }

   goToNextPage() {
      if (this.userIsAllowedToGoToNextPage()) {
         this.activePage++
      } else if (this.userNeedsToAcceptDataprivacy()) {
         this.store.dispatch(profileActions.createProfile())
      } else if (this.userIsOnLastPage()) {
         this.router.navigate(['/find'])
         this.activePage = 0
      }
   }
}
