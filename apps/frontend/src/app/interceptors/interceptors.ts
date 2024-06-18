import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, catchError, finalize, first, mergeMap, throwError } from 'rxjs'
import { LoadingIdicatorService } from '../services/loading-idicator.service'
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

export const loadingInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
   const loadingService = inject(LoadingIdicatorService)
   loadingService.setIsLoading()

   return next(req).pipe(
      catchError((e) => {
         loadingService.setNotLoading()
         return throwError(() => e)
      }),
      finalize(() => {
         loadingService.setNotLoading()
      })
   )
}
