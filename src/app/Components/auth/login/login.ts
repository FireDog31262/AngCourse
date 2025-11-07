import { Component, inject, viewChild, afterNextRender, ElementRef, ApplicationRef } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.less']
})
export class Login {
  authService = inject(AuthService);
  // appRef = inject(ApplicationRef);
  // formRef = viewChild<NgForm>('f');
  // emailInput = viewChild<ElementRef>('emailInput');
  // passwordInput = viewChild<ElementRef>('passwordInput');

  constructor() {
    // // Handle browser autofill in zoneless apps
    // afterNextRender(() => {
    //   // Multiple checks to catch autofill at different timing
    //   [100, 300, 500].forEach(delay => {
    //     setTimeout(() => {
    //       this.checkAutofill();
    //     }, delay);
    //   });
    // });
  }

  // private checkAutofill() {
  //   const form = this.formRef();
  //   const emailEl = this.emailInput()?.nativeElement;
  //   const passwordEl = this.passwordInput()?.nativeElement;

  //   if (emailEl && passwordEl && form) {
  //     // Check if inputs have values (autofilled)
  //     if (emailEl.value && passwordEl.value) {
  //       // Manually trigger input events to force Angular to recognize the values
  //       emailEl.dispatchEvent(new Event('input', { bubbles: true }));
  //       passwordEl.dispatchEvent(new Event('input', { bubbles: true }));

  //       // Update form validation
  //       form.form.patchValue({
  //         email: emailEl.value,
  //         password: passwordEl.value
  //       });

  //       // Trigger change detection in zoneless app
  //       this.appRef.tick();
  //     }
  //   }
  // }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.error('❌ Form is invalid');
      return;
    }

    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
  }
}
