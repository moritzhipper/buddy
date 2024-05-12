import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Remindable } from '../../../../models';
import { InputService } from '../../../../services/input.service';
import { scrollToBottomIfChildrenOverflow } from '../../../../utils';


@Component({
  selector: 'app-input-call-time',
  templateUrl: './input-call-time.component.html',
  styleUrls: ['./input-call-time.component.scss', './../input-styles.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition(':leave', [
        animate('200ms', style({ opacity: 0, transform: 'scale(.9)' })),
        animate('200ms cubic-bezier(.41,0,0,.99)', style({ height: 0 })),
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.9)', height: '0%' }),
        animate('200ms cubic-bezier(.41,0,0,.99)', style({ opacity: 0, transform: 'scale(.9)', height: '*' })),
        animate('200ms cubic-bezier(.41,0,0,.99)', style({ height: '*', opacity: 1, transform: 'scale(1)' })),
      ])
    ])
  ]
})
export class InputCallTimeComponent implements OnInit, AfterViewInit {

  @Input() preset?: Remindable[];
  @ViewChild('htmlFormElements', { static: false }) htmlFormElements: ElementRef<HTMLElement>;

  weekdays = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'];

  callTimesFormArray: FormArray;
  callTimesForm: FormGroup;
  deletionModeIsOn = false;

  constructor(private _fb: FormBuilder, private _is: InputService) { }

  ngOnInit(): void {
    //init Form with preset or one empty element
    if (this.preset) {
      this.callTimesFormArray = this._fb.array(this.preset.map(v => this.createCalltimeFormElement(v)));
    } else {
      this.callTimesFormArray = this._fb.array([this.createCalltimeFormElement()])
    }
    this.callTimesForm = this._fb.group({ callTimes: this.callTimesFormArray });
  }

  ngAfterViewInit(): void {
    scrollToBottomIfChildrenOverflow(this.htmlFormElements.nativeElement)
  }

  addCallTimeFormElement() {
    this.callTimesFormArray.push(this.createCalltimeFormElement());

    // wait for new element to be added to dom before scrolling
    setTimeout(
      () => scrollToBottomIfChildrenOverflow(this.htmlFormElements.nativeElement, false, 400)
      , 200)
    this.deletionModeIsOn = false;
  }

  deleteCallTimeFormElement(index: number) {
    this.callTimesFormArray.removeAt(index);
    this.deletionModeIsOn = false;
  }

  createCalltimeFormElement(preset?: Remindable): FormGroup {
    return this._fb.group({
      weekday: [preset?.weekday || '', Validators.required],
      from: [preset?.from || '', Validators.required],
      to: [preset?.to || '', Validators.required],
      reminder: [preset?.reminder || false]
    });
  }

  toggleDeletionMode() {
    this.deletionModeIsOn = !this.deletionModeIsOn;
  }

  submit() {
    this.callTimesForm.valid && this._is.confirmValue(this.callTimesForm.value.callTimes)
  }

  discard() {
    this._is.discardValueChanges();
  }
}
