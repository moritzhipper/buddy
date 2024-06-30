import { CommonModule } from '@angular/common'
import { Component, OnDestroy, inject } from '@angular/core'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, Subscription, combineLatest } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { selectUserProfile } from '../../../store/buddy.selectors'

@Component({
   selector: 'app-navigation-bar',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './navigation-bar.component.html',
   styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnDestroy {
   private loginRoute = '/login'

   private activeRoute: Observable<string>
   private router = inject(Router)
   private profile = inject(Store).select(selectUserProfile)

   route: string
   showLoggedInView = false
   showNotLoggedInView = false

   subscription: Subscription

   constructor() {
      this.activeRoute = this.router.events.pipe(
         filter((event) => event instanceof NavigationEnd),
         map((event: NavigationEnd) => event.urlAfterRedirects)
      )

      this.subscription = combineLatest([this.activeRoute, this.profile]).subscribe(([route, profile]) => {
         this.route = route
         const isOnLoginPage = route === this.loginRoute

         const userIsLoggedIn = !!profile.secret

         this.showLoggedInView = !isOnLoginPage && userIsLoggedIn
         this.showNotLoggedInView = !isOnLoginPage && !userIsLoggedIn
      })
   }
   ngOnDestroy(): void {
      this.subscription.unsubscribe()
   }
}
