import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { fadeInAnimation, fadeOutAnimation } from "apps/buddy_frontend/src/app/animations";
import { Therapist } from "apps/buddy_frontend/src/app/models";
import { InputResolveTypes, InputService, InputTypes } from "apps/buddy_frontend/src/app/modules/input-flyin/service/input.service";
import { therapistActions } from "apps/buddy_frontend/src/app/store/buddy.actions";
import { selectTherapists } from "apps/buddy_frontend/src/app/store/buddy.selectors";
import { isCurrentTimeInRange } from "apps/buddy_frontend/src/app/utiles-time";
import { trackById } from "apps/buddy_frontend/src/app/utils";
import { map } from "rxjs";
import { PagePlaceholderTextComponent } from "../../../shared/page-placeholder-text/page-placeholder-text.component";
import { TherapistCalendarComponent } from "../therapist-calendar/therapist-calendar.component";
import { TherapistListItemComponent } from "../therapist-list-item/therapist-list-item.component";


@Component({
  selector: 'app-find-page',
  templateUrl: './find-page.component.html',
  styleUrls: ['./find-page.component.scss'],
  standalone: true,
  imports: [CommonModule, PagePlaceholderTextComponent, TherapistCalendarComponent, TherapistListItemComponent],
  animations: [
    fadeOutAnimation,
    fadeInAnimation
  ]
})
export class FindPageComponent {

  calendarIsVisible = false;

  store = inject(Store);
  therapists$ = this.store.select(selectTherapists);
  tharpistCallable$ = this.therapists$.pipe(map(this.isOneCallable));
  hasTherapists$ = this.therapists$.pipe(map(therapists => therapists?.length > 0))
  inputService = inject(InputService);

  trackById = trackById;

  addTherapist(): void {
    this.inputService.openInputDialogue({
      header: 'Therapeut*in hinzufügen',
      description: 'Lege die Person neu an oder importiere sie',
      type: InputTypes.THERAPIST
    }).then(v => {
      if (v.type === InputResolveTypes.CONFIRM) {
        this.store.dispatch(therapistActions.create({ props: v.value }))
      }
    });
  }

  toggleCalendar() {
    this.calendarIsVisible = !this.calendarIsVisible;
  }

  private isOneCallable(therapistList: Therapist[]) {
    return therapistList.some(therapist => therapist?.callTimes?.some(isCurrentTimeInRange))
  }
}
