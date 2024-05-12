import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Appointment } from '../../../../models';
import { InputService } from '../../../../services/input.service';


@Component({
  selector: 'app-input-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input-appointment.component.html',
  styleUrls: ['./input-appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAppointmentComponent implements OnInit, OnDestroy {

  @Input() preset?: Appointment;

  appointmentForm: FormGroup;
  weekdays = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];
  inputService = inject(InputService);
  formBuilder = inject(FormBuilder);

  subscription: Subscription;

  ngOnInit(): void {
    this.appointmentForm = this.formBuilder.group({
      date: [this.preset?.date, Validators.required],
      weekday: this.preset?.weekday,
      from: [this.preset?.from || '', Validators.required],
      to: [this.preset?.to || '', Validators.required],
      isRepeating: this.preset?.isRepeating || false,
    });

    this.subscription = this.appointmentForm.valueChanges
      .pipe(map(v => v.isRepeating), distinctUntilChanged())
      .subscribe((isRepeating) => {
        const inputDay = this.appointmentForm.get('weekday');
        const inputDate = this.appointmentForm.get('date');

        if (isRepeating === false) {
          inputDay.clearValidators();
          inputDate.setValidators([Validators.required])
        } else if (isRepeating === true) {
          inputDay.setValidators([Validators.required])
          inputDate.clearValidators();
        }

        this.appointmentForm.get('date').updateValueAndValidity();
        this.appointmentForm.get('weekday').updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submit() {
    this.appointmentForm.valid && this.inputService.confirmValue(this.appointmentForm.value)
  }

  discard() {
    this.inputService.discardValueChanges();
  }
}
