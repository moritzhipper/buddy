import {
   HttpEvent,
   HttpHandlerFn,
   HttpInterceptorFn,
   HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, first, mergeMap } from 'rxjs';
import { selectAuth } from '../store/buddy.selectors';

// todo: nur über cookie regeln
export const authInterceptorFn: HttpInterceptorFn = (
   req: HttpRequest<unknown>,
   next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
   const store = inject(Store);

   return store.select(selectAuth).pipe(
      first(),
      mergeMap((auth) => {
         const session = auth.session;
         if (!session) {
            return next(req);
         } else {
            const authReq = req.clone({ setHeaders: { SessionID: session } });
            return next(authReq);
         }
      })
   );
};
