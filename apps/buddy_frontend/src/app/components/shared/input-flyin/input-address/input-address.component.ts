import {
   ChangeDetectionStrategy,
   Component,
   Input,
   OnInit,
} from '@angular/core';
import {
   FormBuilder,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';
import { Address } from '../../../../models';
import { InputService } from '../../../../services/input.service';

@Component({
   selector: 'app-input-address',
   templateUrl: './input-address.component.html',
   styleUrls: ['./input-address.component.scss'],
   standalone: true,
   imports: [FormsModule, ReactiveFormsModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAddressComponent implements OnInit {
   @Input() preset?: Address;
   addressForm: FormGroup;

   constructor(private _fb: FormBuilder, private _is: InputService) {}

   ngOnInit(): void {
      this.addressForm = this._fb.group({
         street: [this.preset?.street || '', Validators.required],
         number: [this.preset?.number || '', Validators.required],
         city: [this.preset?.city || '', Validators.required],
         postalCode: [this.preset?.postalCode || '', Validators.required],
      });
   }

   submit() {
      this.addressForm.valid && this._is.confirmValue(this.addressForm.value);
   }

   discard() {
      this._is.discardValueChanges();
   }
}
