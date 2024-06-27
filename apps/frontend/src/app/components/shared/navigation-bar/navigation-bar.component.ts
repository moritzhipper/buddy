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
   private legalRoute = '/legal'
   isBarVisible: Observable<boolean>

   activeRoute: Observable<string>
   private router = inject(Router)
   private profile = inject(Store).select(selectUserProfile)

   route: string
   isNotLogin = false
   isOnLegal = false
   isLoggedIn = false

   showLoggedInView = false
   showNotLoggedInView = false

   subscriptions: Subscription[]

   constructor() {
      this.activeRoute = this.router.events.pipe(
         filter((event) => event instanceof NavigationEnd),
         map((event: NavigationEnd) => event.urlAfterRedirects)
      )

      combineLatest([this.activeRoute, this.profile]).subscribe(([route, profile]) => {
         this.route = route

         const isLogin = route === this.loginRoute
         const userNotLoggedInOnInfoPages = !profile.secret && route.includes(this.legalRoute)
         this.showLoggedInView = !isLogin && !userNotLoggedInOnInfoPages

         this.showNotLoggedInView = !isLogin && userNotLoggedInOnInfoPages
      })

      this.profile.subscribe((profile) => {
         console.log(!!profile?.secret)

         this.isLoggedIn = !!profile?.secret
      })
   }
   ngOnDestroy(): void {
      // throw new Error('Method not implemented.')
   }
}
