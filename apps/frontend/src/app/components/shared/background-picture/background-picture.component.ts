import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
   selector: 'app-background-picture',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './background-picture.component.html',
   styleUrl: './background-picture.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundPictureComponent {
   @Input() name: string
   @Input() isLight = false
}
