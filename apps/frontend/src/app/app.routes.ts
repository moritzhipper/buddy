import { Route } from '@angular/router'
import { ListPageComponent } from './components/pages/list/list-page/list-page.component'
import { InfoPageComponent } from './components/pages/info/info-page/info-page.component'
import { LoginPageComponent } from './components/pages/login/login-page/login-page.component'
import { SearchPageComponent } from './components/pages/search/search-page/search-page.component'
import { SettingsPageComponent } from './components/pages/settings/settings-page/settings-page.component'
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
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Info',
         },
         {
            path: 'find',
            component: ListPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Liste',
         },
         {
            path: 'search',
            component: SearchPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Suche',
         },
         {
            path: 'settings',
            component: SettingsPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Einstellungen',
         },
         { path: '', redirectTo: '/list', pathMatch: 'full' },
         { path: '**', redirectTo: '/list', pathMatch: 'full' },
      ],
   },
]
