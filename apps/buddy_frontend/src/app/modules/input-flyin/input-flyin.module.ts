import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputAddressComponent } from './input-address/input-address.component';
import { InputAppointmentComponent } from './input-appointment/input-appointment.component';
import { InputCallTimeComponent } from './input-call-time/input-call-time.component';
import { InputConfirmComponent } from './input-confirm/input-confirm.component';
import { InputPasswordComponent } from './input-password/input-password.component';
import { InputSingleComponent } from './input-single/input-single.component';
import { InputTherapistComponent } from "./input-therapist/input-therapist.component";
import { InputTherapyTypeComponent } from './input-therapy-type/input-therapy-type.component';
import { InputWrapperComponent } from './input-wrapper/input-wrapper.component';

@NgModule({
  declarations: [
    InputWrapperComponent,
    InputAddressComponent,
    InputCallTimeComponent,
    InputAppointmentComponent,
    InputTherapyTypeComponent,
    InputPasswordComponent,
    InputSingleComponent,
    InputConfirmComponent,
    InputTherapistComponent
  ],
  exports: [
    InputWrapperComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InputFlyinModule { }
