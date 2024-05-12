import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { expandAnimation } from '../../../animations';
import { ToastType } from '../../../models';
import { ToastService } from '../../../services/toast.service';
import { profileActions } from '../../../store/buddy.actions';
import { BuddyState } from '../../../store/buddy.state';
import { InputService } from '../service/input.service';


@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss', './../input-styles.scss'],
  animations: [expandAnimation]
})
export class InputPasswordComponent implements OnInit, OnDestroy {
  private readonly CHECK_FOR_NUMBER_REGEX = new RegExp('.*[0-9].*');
  private readonly CHECK_FOR_STRING_REGEX = new RegExp('.*[a-zA-ZäöüßÄÖÜ].*');
  readonly PASSWORD_MIN_LENGTH = 12;

  passwordForm: FormGroup;
  password: string;
  repeatPassword: string;

  repeatPasswordIsNotEmpty = false;

  currentStep = 0;

  validationErrors = {
    hasNumber: false,
    hasLetter: false,
    hasMinLength: false
  }

  private subscription: Subscription;

  constructor(private _fb: FormBuilder, private _is: InputService, private _store: Store<BuddyState>, private _ts: ToastService) { }

  ngOnInit(): void {
    this.passwordForm = this._fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(this.PASSWORD_MIN_LENGTH),
        Validators.pattern(this.CHECK_FOR_NUMBER_REGEX),
        Validators.pattern(this.CHECK_FOR_STRING_REGEX)
      ]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.subscription = this.passwordForm.valueChanges.subscribe(v => {
      this.updateValidationErrors(v.password);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateValidationErrors(password: string) {
    this.validationErrors = {
      hasNumber: this.CHECK_FOR_NUMBER_REGEX.test(password),
      hasLetter: this.CHECK_FOR_STRING_REGEX.test(password),
      hasMinLength: password.length >= this.PASSWORD_MIN_LENGTH
    }
  }

  approveStepOne() {
    if (this.passwordForm.valid) {
      this.currentStep = 1;
    }
  }

  approveStepTwo() {
    const passwordRepeatedCorrectly = this.repeatPassword === this.passwordForm.value.password;
    if (passwordRepeatedCorrectly) {
      this.submit();
    } else {
      alert('repeat password is wrong')
      this._ts.sendToast({
        type: ToastType.ERROR,
        text: 'shit'
      });
    }
  }

  setRepeatPassword($event: Event) {
    this.repeatPassword = ($event.target as HTMLInputElement).value
  }

  navigateToStepOne() {
    this.currentStep = 0;
  }

  submit() {
    //todo -> backend call hier, dann ladespinner, wenn 200er, dann erfolgsmeldung animation, dann resolve in store
    if (this.passwordForm.valid) {
      this._store.dispatch(profileActions.createCredentials({ login: { ...this.passwordForm.value } }));
      this._is.confirmValue();
    }
  }

  discard() {
    this._is.discardValueChanges();
  }
}
