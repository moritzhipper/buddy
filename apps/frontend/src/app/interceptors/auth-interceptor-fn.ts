import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, first, mergeMap } from 'rxjs'
import { selectUserProfile } from '../store/buddy.selectors'

// todo: nur über cookie regeln
export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
   const store = inject(Store)

   return store.select(selectUserProfile).pipe(
      first(),
      mergeMap((profile) => {
         const secret = profile.secret
         if (!secret) {
            return next(req)
         } else {
            const authReq = req.clone({ setHeaders: { secret } })
            return next(authReq)
         }
      })
   )
}
