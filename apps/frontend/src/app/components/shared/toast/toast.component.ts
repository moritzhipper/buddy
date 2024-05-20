import { animate, style, transition, trigger } from '@angular/animations'
import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { Toast, ToastType } from '../../../models'
import { ToastService } from '../../../services/toast.service'
import { CommonModule } from '@angular/common'

@Component({
   selector: 'app-toast',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './toast.component.html',
   styleUrls: ['./toast.component.scss'],
   animations: [
      trigger('fade', [
         transition(':enter', [
            style({ opacity: 0, transform: 'translateY(8px)' }),
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
         ]),
         transition(':leave', [animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(8px)' }))]),
      ]),
   ],
})
export class ToastComponent {
   ToastType = ToastType
   toasts$: Observable<Toast>

   constructor(private _toastService: ToastService) {
      this.toasts$ = this._toastService.toasts$
   }
}
