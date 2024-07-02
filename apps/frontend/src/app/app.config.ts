import { ApplicationConfig } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { provideServiceWorker } from '@angular/service-worker'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { appRoutes } from './app.routes'

import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideEffects } from '@ngrx/effects'
import { environment } from '../environments/environment'
import { authInterceptorFn, loadingInterceptorFn } from './interceptors/interceptors'
import { localConfigReducer, metaReducers, profileReducer, searchReducer, therapistsReducer } from './store/buddy.reducer'
import { ProfileEffects } from './store/effects/profile.effects'
import { SearchEffects } from './store/effects/search.effects'
import { TherapistsEffects } from './store/effects/therapists.effects'
import { StateSyncEffects } from './store/effects/utils.effects'
import { LocalConfigEffects } from './store/effects/local-config.effects'

export const appConfig: ApplicationConfig = {
   providers: [
      provideRouter(appRoutes),
      provideStore(
         {
            therapists: therapistsReducer,
            profile: profileReducer,
            search: searchReducer,
            localConfig: localConfigReducer
         },
         { metaReducers }
      ),
      provideEffects(StateSyncEffects, ProfileEffects, TherapistsEffects, SearchEffects, LocalConfigEffects),
      provideStoreDevtools(),
      provideAnimations(),
      provideHttpClient(withInterceptors([authInterceptorFn, loadingInterceptorFn])),
      provideServiceWorker('ngsw-worker.js', {
         enabled: environment.production,
         // Register the ServiceWorker as soon as the application is stable
         // or after 30 seconds (whichever comes first).
         registrationStrategy: 'registerWhenStable:30000',
      }),
   ],
}
