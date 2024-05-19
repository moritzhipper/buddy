import { CommonModule } from '@angular/common';
import {
   AfterViewInit,
   ChangeDetectionStrategy,
   Component,
   ElementRef,
   Input,
   OnInit,
   ViewChild,
} from '@angular/core';
import {
   FormBuilder,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
} from '@angular/forms';
import { TherapyTypeList } from '../../../../models';
import { InputService } from '../../../../services/input.service';
import { scrollToBottomIfChildrenOverflow } from '../../../../utils';

@Component({
   selector: 'app-input-therapy-type',
   imports: [CommonModule, FormsModule, ReactiveFormsModule],
   standalone: true,
   templateUrl: './input-therapy-type.component.html',
   styleUrls: ['./input-therapy-type.component.scss', './../input-styles.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTherapyTypeComponent implements OnInit, AfterViewInit {
   @Input() preset: string[];
   @ViewChild('htmlFormElements', { static: false })
   htmlFormElements: ElementRef<HTMLElement>;

   TherapyTypeList = TherapyTypeList;
   therapyTypeForm: FormGroup;

   constructor(private _fb: FormBuilder, private _is: InputService) {}

   ngOnInit(): void {
      let formControls = {};

      // init FormControls.
      // Set presettherapytypes if given by preset input
      this.TherapyTypeList.forEach((therapyType) => {
         const hasTherapyType = this.preset.includes(therapyType);
         formControls[therapyType] = this._fb.control(hasTherapyType);
      });

      this.therapyTypeForm = this._fb.group(formControls);
   }

   ngAfterViewInit(): void {
      scrollToBottomIfChildrenOverflow(this.htmlFormElements.nativeElement);
   }

   submit(): void {
      this.therapyTypeForm.valid &&
         this._is.confirmValue(
            this.getSelectedTypes(this.therapyTypeForm.value)
         );
   }

   getSelectedTypes(formElements) {
      return Object.keys(formElements).filter(
         (therapyType) => formElements[therapyType]
      );
   }

   discard() {
      this._is.discardValueChanges();
   }
}
