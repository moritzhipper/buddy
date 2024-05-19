import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import {
   httpErrorActions,
   loadAllDataActions,
   settingsActions,
} from '../buddy.actions';
import { selectSettings } from '../buddy.selectors';
import { BuddyState } from '../buddy.state';
import { Settings } from '../../models';
import { BackendAdapterService } from '../../services/backend-adapter.service';

@Injectable()
export class SettingsEffects {
   backendAdapter = inject(BackendAdapterService);
   store = inject(Store<BuddyState>);
   actions$ = inject(Actions);
   route = this.backendAdapter.ROUTE_SETTINGS;

   // fetch missing email or secret after login
   loadSettingsInfoAfterLogin = createEffect(() =>
      this.actions$.pipe(
         ofType(loadAllDataActions.basicUser),
         switchMap(() =>
            this.backendAdapter
               .get<Settings>(this.backendAdapter.ROUTE_SETTINGS)
               .pipe(
                  map((settings) => settingsActions.save({ props: settings })),
                  catchError((error) => of(httpErrorActions.handle({ error })))
               )
         )
      )
   );

   toggleAppt$ = createEffect(() =>
      this.actions$.pipe(
         ofType(settingsActions.toggleAppointment),
         switchMap(() => this.store.select(selectSettings).pipe(take(1))),
         map((settings) =>
            settingsActions.update({
               props: {
                  remindNextAppointment: !settings.remindNextAppointment,
               },
            })
         )
      )
   );

   updateSettings$ = createEffect(() =>
      this.actions$.pipe(
         ofType(settingsActions.update),
         switchMap((action) =>
            this.backendAdapter.patch(action.props, this.route).pipe(
               map((settings) => settingsActions.save({ props: settings })),
               catchError((error) => of(httpErrorActions.handle({ error })))
            )
         )
      )
   );
}
