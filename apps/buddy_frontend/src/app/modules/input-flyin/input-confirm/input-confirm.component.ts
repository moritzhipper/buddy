import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InputService } from '../service/input.service';

@Component({
  selector: 'app-input-confirm',
  standalone: true,
  templateUrl: './input-confirm.component.html',
  styleUrls: ['./input-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputConfirmComponent {

  @Input() description: string;

  constructor(private _is: InputService) { }

  submit() {
    this._is.confirmValue();
  }

  discard() {
    this._is.discardValueChanges();
  }
}
