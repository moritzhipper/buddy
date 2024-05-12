import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, catchError, map, of, switchMap } from 'rxjs';
import { fadeInFromZeroHeight } from '../../../../animations';
import { Therapist } from '../../../../models';
import { BackendAdapterService } from '../../../../services/backend-adapter.service';
import { InputService } from '../../../../services/input.service';


@Component({
  selector: 'app-input-therapist',
  templateUrl: './input-therapist.component.html',
  styleUrls: ['./input-therapist.component.scss', './../input-styles.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  animations: [fadeInFromZeroHeight]
})
export class InputTherapistComponent implements OnDestroy {

  private is = inject(InputService);
  private fb = inject(FormBuilder);
  private ba = inject(BackendAdapterService);

  therapistForm = this.fb.group({
    therapist: ['', [Validators.required, Validators.minLength(3)]],
  })

  subscription: Subscription;
  suggestions: Therapist[];
  hasSuggestions: boolean;

  suggestionsAreExpanded = false;

  constructor() {
    this.subscription = this.therapistForm.valueChanges.pipe(
      map(v => v.therapist),
      switchMap(v => {
        if (v.length <= 2) {
          return of([]);
        } else {
          return this.ba.getSuggestions({ name: v }).pipe(catchError(() => of([])))
        }
      }),
    ).subscribe(v => {
      this.suggestions = v;
      this.hasSuggestions = v?.length > 0;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectTherapist(id: string) {
    this.is.confirmValue({ id })
  }

  discard() {
    this.is.discardValueChanges();
  }

  submit() {
    this.therapistForm.valid && this.is.confirmValue({ name: this.therapistForm.value.therapist });
  }
}
