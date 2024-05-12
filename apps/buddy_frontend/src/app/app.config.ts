import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { authInterceptorFn } from './interceptors/auth-interceptor-fn';
import {
   appointmentsReducer,
   authReducer,
   goalsReducer,
   metaReducers,
   notesReducer,
   settingsReducer,
   therapistsReducer,
   userProfileReducer,
} from './store/buddy.reducer';
import { AuthEffects } from './store/effects/auth.effects';
import { CrudEffects } from './store/effects/crud/crud-effects';
import { ProfileEffects } from './store/effects/profile.effects';
import { SettingsEffects } from './store/effects/settings.effects';
import { StateSyncEffects } from './store/effects/state-sync.effects';

export const appConfig: ApplicationConfig = {
   providers: [
      provideRouter(appRoutes),
      provideStore(
         {
            therapists: therapistsReducer,
            notes: notesReducer,
            goals: goalsReducer,
            appointments: appointmentsReducer,
            settings: settingsReducer,
            profile: userProfileReducer,
            auth: authReducer,
         },
         { metaReducers }
      ),
      provideEffects(
         CrudEffects,
         SettingsEffects,
         StateSyncEffects,
         AuthEffects,
         ProfileEffects
      ),
      provideStoreDevtools(),
      provideAnimations(),
      provideHttpClient(withInterceptors([authInterceptorFn])),
      provideServiceWorker('ngsw-worker.js', {
         enabled: environment.production,
         // Register the ServiceWorker as soon as the application is stable
         // or after 30 seconds (whichever comes first).
         registrationStrategy: 'registerWhenStable:30000',
      }),
   ],
};
