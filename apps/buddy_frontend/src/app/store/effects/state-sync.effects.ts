import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, tap, withLatestFrom } from "rxjs/operators";
import { authActions, httpErrorActions, loadAllDataActions, profileActions } from "../buddy.actions";
import { selectUserProfile } from "../buddy.selectors";
import { BuddyState } from "../buddy.state";
import { ToastType } from "./models";
import { ToastService } from "./services/toast.service";

@Injectable()
export class StateSyncEffects {

    private toastService = inject(ToastService);
    private actions$ = inject(Actions);
    private store = inject(Store<BuddyState>);

    loadProfileInfoAfterLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(profileActions.saveCredentials),
            map(action => {
                if (action.profile.isFullUser) {
                    return loadAllDataActions.fullUser()
                } else {
                    return loadAllDataActions.basicUser()
                }
            })
        )
    );


    handleHTTPError$ = createEffect(() =>
        this.actions$.pipe(
            ofType(httpErrorActions.handle),
            withLatestFrom(this.store.select(selectUserProfile)),
            map(([action, profile]) => {
                const errorMessage = action?.error?.error?.message;

                if (action.error.status === 401 && profile.isFullUser) {
                    // session not valid, request password and create new one 
                    return authActions.requestPassword({ secret: profile.secret })
                } else if (action.error.status === 401 && !profile.isFullUser) {
                    // session not valid. new session creatable without user interaction
                    this.toastService.sendToast({ type: ToastType.ERROR, text: 'Es ist ein Fehler aufgetreten. Versuch es bitte erneut' });
                    return authActions.login({ login: { secret: profile.secret } })
                } else if (action.error.status === 404) {
                    // profile deleted, 
                    this.toastService.sendToast({ type: ToastType.ERROR, text: 'Dein Profil konnte nicht gefunden werden.' })
                    return profileActions.profileNotExisting();
                } else {
                    // somehow handle this
                    return httpErrorActions.handleUnspecific({ error: action.error })
                }
            })
        )
    );

    handleUnexpectedHTTPError$ = createEffect(() =>
        this.actions$.pipe(
            ofType(httpErrorActions.handleUnspecific),
            tap((action) => {
                // TODO send to log endpoint here
                this.toastService.sendToast({ type: ToastType.ERROR, text: 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.' });
            })
        ),
        { dispatch: false }
    );

}