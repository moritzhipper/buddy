import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AccordionComponent } from '../accordion/accordion.component'
import { BackgroundPictureComponent } from '../../../shared/background-picture/background-picture.component'

@Component({
   selector: 'app-info-page',
   templateUrl: './info-page.component.html',
   styleUrls: ['./info-page.component.scss'],
   standalone: true,
   imports: [AccordionComponent, RouterModule, BackgroundPictureComponent],
})
export class InfoPageComponent {}
