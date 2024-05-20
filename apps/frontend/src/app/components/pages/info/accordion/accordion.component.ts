import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { expandAnimation } from 'apps/frontend/src/app/animations'

@Component({
   selector: 'app-accordion',
   templateUrl: './accordion.component.html',
   styleUrls: ['./accordion.component.scss'],
   standalone: true,
   imports: [CommonModule],
   animations: [expandAnimation],
})
export class AccordionComponent {
   isExpanded = false
}
