import { Route } from '@angular/router'
import { DatenschutzPageComponent } from './components/pages/datenschutz/datenschutz-page.component'
import { ImpressumPageComponent } from './components/pages/impressum/impressum-page.component'
import { InfoPageComponent } from './components/pages/info/info-page/info-page.component'
import { ListPageComponent } from './components/pages/list/list-page/list-page.component'
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
            path: 'list',
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
         {
            path: 'impressum',
            component: ImpressumPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Impressum',
         },
         {
            path: 'datenschutz',
            component: DatenschutzPageComponent,
            canActivate: [IsLoggedInGuard],
            title: 'Buddy | Datenschutz',
         },
         { path: '', redirectTo: '/list', pathMatch: 'full' },
         { path: '**', redirectTo: '/list', pathMatch: 'full' },
      ],
   },
]
