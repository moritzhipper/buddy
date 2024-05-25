import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Store } from '@ngrx/store'
import { profileActions } from 'apps/frontend/src/app/store/buddy.actions'
import { selectUserProfile } from 'apps/frontend/src/app/store/buddy.selectors'
import { BuddyState } from 'apps/frontend/src/app/store/buddy.state'
import { Observable, map } from 'rxjs'
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
export class TutorialWrapperComponent {
   activePage = 0
   pagesCount = 6
   private store = inject(Store<BuddyState>)
   hasQRKey$: Observable<boolean>
   router = inject(Router)

   constructor() {
      this.hasQRKey$ = this.store.select(selectUserProfile).pipe(map((profile) => !!profile.secret))
   }

   goToLastPage() {
      this.activePage !== 0 && this.activePage--
   }

   goToNextPage() {
      if (this.activePage !== this.pagesCount - 1) {
         this.activePage++
      } else if (this.activePage === this.pagesCount - 1) {
         this.router.navigate(['/find'])
         this.activePage = 0
      }
   }

   createQRKey() {
      this.store.dispatch(profileActions.createProfile())
   }
}