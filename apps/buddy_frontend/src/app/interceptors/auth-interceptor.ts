import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, first, mergeMap } from 'rxjs';
import { selectAuth } from '../store/buddy.selectors';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private _store = inject(Store);

    // todo: nur über cookie regeln
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this._store.select(selectAuth).pipe(
            first(),
            mergeMap((auth) => {
                const session = auth.session;
                if (!session) {
                    return next.handle(req);
                } else {
                    const authReq = req.clone({ setHeaders: { 'SessionID': session } });
                    return next.handle(authReq);
                }
            })
        );
    }
}