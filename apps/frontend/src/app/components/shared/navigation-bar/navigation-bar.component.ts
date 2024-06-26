import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'

@Component({
   selector: 'app-navigation-bar',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './navigation-bar.component.html',
   styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent {
   activeRoute: Observable<string>
   private hiddenRoutes = ['/datenschutz', '/impressum', '/login']

   constructor(private _router: Router) {
      this.activeRoute = this._router.events.pipe(
         filter((event) => event instanceof NavigationEnd),
         map((event: NavigationEnd) => event.urlAfterRedirects)
      )
   }

   isVisibleRoute(route: string): boolean {
      return !this.hiddenRoutes.includes(route)
   }
}
