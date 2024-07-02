import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NotificationService } from 'apps/frontend/src/app/services/notification.service'
import { BackgroundPictureComponent } from '../../../shared/background-picture/background-picture.component'
import { AccordionComponent } from '../accordion/accordion.component'

@Component({
   selector: 'app-info-page',
   templateUrl: './info-page.component.html',
   styleUrls: ['./info-page.component.scss'],
   standalone: true,
   imports: [AccordionComponent, RouterModule, BackgroundPictureComponent],
})
export class InfoPageComponent {
   private notificationService = inject(NotificationService)
   verifySubscriptionExists() {
      this.notificationService.verifySubscriptionExists()
   }
}
