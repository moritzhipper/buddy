import { Injectable, inject } from "@angular/core";
import { BackendAdapterService } from "../../../services/backend-adapter.service";
import { appointmentActions, goalActions, noteActions, therapistActions } from "../../buddy.actions";
import { CrudEffectsGenerator } from "./crud-effects-generator";


@Injectable()
export class CrudEffects {

    private backendAdapter = inject(BackendAdapterService);

    // goals
    private goalFX = new CrudEffectsGenerator(goalActions, this.backendAdapter.ROUTE_GOALS);
    addGoal$ = this.goalFX.createEffect();
    readOnLoginGoal$ = this.goalFX.readOnLoginEffect();
    updateGoal$ = this.goalFX.updateEffect();
    deleteGoal$ = this.goalFX.deleteEffect();

    // notes
    private noteFX = new CrudEffectsGenerator(noteActions, this.backendAdapter.ROUTE_NOTES);
    addNote$ = this.noteFX.createEffect();
    readOnLoginNote$ = this.noteFX.readOnLoginEffect();
    updateNote$ = this.noteFX.updateEffect();
    deleteNote$ = this.noteFX.deleteEffect();

    // therapist
    private therapistFX = new CrudEffectsGenerator(therapistActions, this.backendAdapter.ROUTE_THERAPIST);
    addTherapist$ = this.therapistFX.createEffect();
    readOnLoginTherapist$ = this.therapistFX.readOnLoginEffect(false);
    updateTherapist$ = this.therapistFX.updateEffect()
    deleteTherapist$ = this.therapistFX.deleteEffect();

    // appointments
    private appointmentFX = new CrudEffectsGenerator(appointmentActions, this.backendAdapter.ROUTE_APPOINTMENT);
    addAppointment$ = this.appointmentFX.createEffect();
    readOnLoginAppointment$ = this.appointmentFX.readOnLoginEffect();
    updateAppointment$ = this.appointmentFX.updateEffect()
    deleteAppointment$ = this.appointmentFX.deleteEffect();

}