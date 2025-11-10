import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiService } from '../../../shared/ui.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  providers: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    FormsModule,
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
  maxDate = new Date();

  private readonly authService = inject(AuthService);
  private readonly uiService = inject(UiService);
  protected readonly isLoading = this.uiService.isLoading;

  constructor() {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }
  onSubmit(form: NgForm) {
    this.authService.registerUser({
    ...form.value
    });
  }
}
