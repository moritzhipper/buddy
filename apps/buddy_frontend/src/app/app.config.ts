import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';


import { provideHttpClient } from '@angular/common/http';
import { appointmentsReducer, authReducer, goalsReducer, metaReducers, notesReducer, settingsReducer, therapistsReducer, userProfileReducer } from './store/buddy.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes), 
    provideStore({
    therapists: therapistsReducer,
    notes: notesReducer,
    goals: goalsReducer,
    appointments: appointmentsReducer,
    settings: settingsReducer,
    profile: userProfileReducer,
    auth: authReducer
  }, { metaReducers }),
  provideStoreDevtools(),
  provideAnimations(),
  provideHttpClient()
],
};
