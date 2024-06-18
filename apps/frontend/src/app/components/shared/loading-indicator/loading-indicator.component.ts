import { animate, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { LoadingIdicatorService } from '../../../services/loading-indicator.service'

@Component({
   selector: 'app-loading-indicator',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './loading-indicator.component.html',
   styleUrl: './loading-indicator.component.scss',
   animations: [
      trigger('fadeInOut', [
         transition(':enter', [style({ opacity: 0, transform: 'scale(.2)' }), animate('300ms ease', style({ opacity: 1, transform: 'scale(1)' }))]),
         transition(':leave', [style({ opacity: 1 }), animate('300ms', style({ opacity: 0, transform: 'scale(.8)' }))]),
      ]),
   ],
})
export class LoadingIndicatorComponent {
   isLoading: Observable<boolean> = inject(LoadingIdicatorService).loadingState
}
