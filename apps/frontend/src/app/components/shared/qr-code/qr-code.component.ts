import { CommonModule } from '@angular/common';
import {
   ChangeDetectionStrategy,
   Component,
   Input,
   inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { QRCodeModule } from 'angularx-qrcode';
import { map } from 'rxjs/operators';
import { selectUserProfile } from '../../../store/buddy.selectors';

@Component({
   selector: 'app-qr-code',
   templateUrl: './qr-code.component.html',
   styleUrls: ['./qr-code.component.scss'],
   standalone: true,
   imports: [CommonModule, QRCodeModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCodeComponent {
   @Input() set isBig(isBig: boolean) {
      this.isBigLayout = isBig;
      this.sizePX = 200;
   }

   isBigLayout = false;
   sizePX = 100;

   secret$ = inject(Store)
      .select(selectUserProfile)
      .pipe(map((profile) => profile.secret));
}
