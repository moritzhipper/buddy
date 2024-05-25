import { Injectable, inject } from '@angular/core'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { selectUserProfile } from '../store/buddy.selectors'

@Injectable({
   providedIn: 'root',
})
export class IsLoggedInGuard {
   router = inject(Router)
   store = inject(Store)

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.store.select(selectUserProfile).pipe(
         map((profile) => {
            if (profile.secret) {
               return true
            } else {
               this.router.navigateByUrl('/login')
               return false
            }
         })
      )
   }
}
