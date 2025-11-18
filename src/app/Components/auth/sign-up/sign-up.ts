import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  providers: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUp {
  readonly maxDate = new Date();

  private readonly authService = inject(AuthService);
  private readonly store = inject(Store<fromRoot.State>);
  private readonly fb = inject(FormBuilder);
  protected readonly isLoading = this.store.selectSignal(fromRoot.getIsLoading);

  protected readonly signUpForm = this.fb.group({
    name: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    email: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.email] }),
    password: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(6)] }),
    birthday: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
    terms: this.fb.nonNullable.control(false, { validators: [Validators.requiredTrue] })
  });

  constructor() {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  protected get passwordControl() {
    return this.signUpForm.controls.password;
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { name, email, password, birthday } = this.signUpForm.getRawValue();
    this.authService.registerUser({
      name,
      email,
      password,
      birthday: birthday ?? new Date()
    });
  }
}
