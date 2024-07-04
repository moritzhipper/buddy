import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { Store } from '@ngrx/store'
import { localConfigActions } from 'apps/frontend/src/app/store/buddy.actions'
import { selectLocalConfig } from 'apps/frontend/src/app/store/buddy.selectors'
import { map } from 'rxjs/operators'
import { BackgroundPictureComponent } from '../../../shared/background-picture/background-picture.component'
import { AccordionComponent } from '../accordion/accordion.component'

@Component({
   selector: 'app-info-page',
   templateUrl: './info-page.component.html',
   styleUrls: ['./info-page.component.scss'],
   standalone: true,
   imports: [AccordionComponent, RouterModule, BackgroundPictureComponent, CommonModule],
})
export class InfoPageComponent {
   private store = inject(Store)
   notificationsEnabled$ = this.store.select(selectLocalConfig).pipe(map((conf) => conf.notificationsEnabled))
   verifySubscriptionExists() {
      this.store.dispatch(localConfigActions.verifyNotificationsPermission())
   }
}
