import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
   selector: 'app-background-picture',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './background-picture.component.html',
   styleUrl: './background-picture.component.scss',
})
export class BackgroundPictureComponent {
   @Input() imageName: string
}
