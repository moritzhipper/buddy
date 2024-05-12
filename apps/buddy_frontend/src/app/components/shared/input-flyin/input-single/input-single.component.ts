import { CommonModule } from '@angular/common';
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
import { InputService, InputTypes } from '../../../../services/input.service';

@Component({
   selector: 'app-input-single',
   standalone: true,
   imports: [ReactiveFormsModule, FormsModule, CommonModule],
   templateUrl: './input-single.component.html',
   styleUrls: ['./input-single.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSingleComponent implements OnInit {
   singleInputForm: FormGroup;

   @Input() preset: string | number;
   @Input() label: string;
   @Input() type: InputTypes;

   constructor(private _fb: FormBuilder, private _is: InputService) {}

   ngOnInit(): void {
      this.singleInputForm = this._fb.group({});

      switch (this.type) {
         case InputTypes.DATE: {
            this.singleInputForm.addControl(
               'date',
               this._fb.control(this.preset || '', Validators.required)
            );
            break;
         }
         case InputTypes.PHONE: {
            this.singleInputForm.addControl(
               'phone',
               this._fb.control(this.preset || '', Validators.required)
            );
            break;
         }
         case InputTypes.MAIL: {
            this.singleInputForm.addControl(
               'mail',
               this._fb.control(this.preset || '', [
                  Validators.required,
                  Validators.email,
               ])
            );
            break;
         }
         case InputTypes.TEXT_SHORT: {
            this.singleInputForm.addControl(
               'textShort',
               this._fb.control(this.preset || '', [Validators.required])
            );
            break;
         }
         case InputTypes.TEXT_LONG: {
            this.singleInputForm.addControl(
               'textLong',
               this._fb.control(this.preset || '', [Validators.required])
            );
            break;
         }
         case InputTypes.NUMBER: {
            this.singleInputForm.addControl(
               'number',
               this._fb.control(this.preset || '', [Validators.required])
            );
            break;
         }
         case InputTypes.PASSWORD: {
            this.singleInputForm.addControl(
               'password',
               this._fb.control(this.preset || '', [Validators.required])
            );
            break;
         }
      }
   }

   submit() {
      // form only has one value. access via index 0
      this.singleInputForm.valid &&
         this._is.confirmValue(Object.values(this.singleInputForm.value)[0]);
   }

   discard() {
      this._is.discardValueChanges();
   }
}
