import { Route } from '@angular/router'
import { FindPageComponent } from './components/pages/find/find-page/find-page.component'
import { InfoPageComponent } from './components/pages/info/info-page/info-page.component'
import { LoginPageComponent } from './components/pages/login/login-page/login-page.component'
import { RememberPageComponent } from './components/pages/remember-page/remember-page.component'
import { SettingsPageComponent } from './components/pages/settings-page/settings-page.component'
import { TherapyPageComponent } from './components/pages/therapy/therapy-page/therapy-page.component'
import { IsLoggedInGuard } from './guards/is-logged-in.guard'

export const appRoutes: Route[] = [
   {
      path: '',
      children: [
         {
            path: 'login',
            component: LoginPageComponent,
            title: 'Buddy | Login',
         },
         {
            path: 'info',
            component: InfoPageComponent,
            title: 'Buddy | Info',
         },
         {
            path: 'find',
            component: FindPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Finden',
         },
         {
            path: 'remember',
            component: RememberPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Merken',
         },
         {
            path: 'therapy',
            component: TherapyPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Therapie',
         },
         {
            path: 'settings',
            component: SettingsPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Einstellungen',
         },
         { path: '', redirectTo: '/find', pathMatch: 'full' },
         { path: '**', redirectTo: '/find', pathMatch: 'full' },
      ],
   },
]
