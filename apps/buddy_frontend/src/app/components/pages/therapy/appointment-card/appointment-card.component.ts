import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Appointment } from "apps/buddy_frontend/src/app/models";
import { InputService, InputTypes, InputResolveTypes } from "apps/buddy_frontend/src/app/services/input.service";
import { appointmentActions } from "apps/buddy_frontend/src/app/store/buddy.actions";


@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.scss',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AppointmentCardComponent {
  @Input() appointment: Appointment;

  inputService = inject(InputService);
  store = inject(Store);

  editAppointment() {
    this.inputService.openInputDialogue({
      header: 'Termin bearbeiten',
      type: InputTypes.APPOINTMENT,
      preset: this.appointment,
      canRemove: true
    }).then(v => {
      v.type === InputResolveTypes.CONFIRM && this.store.dispatch(appointmentActions.update({ props: { ...v.value, id: this.appointment.id } }))
      v.type === InputResolveTypes.DELETE && this.store.dispatch(appointmentActions.delete({ id: this.appointment.id }))
    })
  }
}
