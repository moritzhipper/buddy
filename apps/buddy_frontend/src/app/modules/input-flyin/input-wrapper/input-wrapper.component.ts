import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { vibrateInfo, vibrateWarning } from '../../../utils';
import { InputAddressComponent } from '../input-address/input-address.component';
import { InputAppointmentComponent } from '../input-appointment/input-appointment.component';
import { InputCallTimeComponent } from '../input-call-time/input-call-time.component';
import { InputConfirmComponent } from '../input-confirm/input-confirm.component';
import { InputPasswordComponent } from '../input-password/input-password.component';
import { InputSingleComponent } from '../input-single/input-single.component';
import { InputTherapistComponent } from '../input-therapist/input-therapist.component';
import { InputTherapyTypeComponent } from '../input-therapy-type/input-therapy-type.component';
import { InputService, InputTypes } from '../service/input.service';


@Component({
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.scss'],
  imports: [
    CommonModule,
    InputPasswordComponent, 
    InputSingleComponent, 
    InputConfirmComponent, 
    InputTherapyTypeComponent, 
    InputAppointmentComponent,
    InputCallTimeComponent,
    InputAddressComponent,
    InputTherapistComponent
  ],
  standalone: true,
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        group([
          animate('200ms', style({ opacity: 1 })),
          query('@flyIn', animateChild())
        ])
      ]),
      transition(':leave', [
        group([
          animate('200ms', style({ opacity: 0 })),
          query('@flyIn', animateChild())
        ]),
      ]),
    ]),
    trigger('flyIn', [
      transition(':enter', [
        style({ transform: 'translateY(40px)' }),
        animate('200ms cubic-bezier(0.000, 1.005, 0.730, 1.010)', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms', style({ transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class InputWrapperComponent implements OnInit, OnDestroy {
  inputTypes = InputTypes;
  configSubject$ = this._inputService.configSubject;
  removeEntryWasClickedOnce = false;
  private _removeEntryTimeout;

  private _isOpenSubject$: Observable<boolean> = this.configSubject$.pipe(map(v => !!v));

  private subscription: Subscription;

  constructor(private _inputService: InputService, @Inject(DOCUMENT) private _document) {
  }

  ngOnInit(): void {
    this.subscription = this._isOpenSubject$.subscribe(isOpen => {
      this._document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeEntryButtonClick() {
    if (!this.removeEntryWasClickedOnce) {
      this.removeEntryWasClickedOnce = true;
      vibrateWarning();

      this._removeEntryTimeout = setTimeout(() => {
        this.removeEntryWasClickedOnce = false;
      }, 2000);

    } else if (this.removeEntryWasClickedOnce) {
      this.removeEntryWasClickedOnce = false;
      vibrateInfo();
      clearTimeout(this._removeEntryTimeout);
      this._inputService.deleteValue();
    }
  }

  isSingleInput = (inputType: InputTypes) => [InputTypes.TEXT_SHORT, InputTypes.NUMBER, InputTypes.TEXT_LONG, InputTypes.PHONE, InputTypes.MAIL, InputTypes.DATE].includes(inputType);
}