import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatCheckboxModule
  ],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.sass']
})
export class SignUp {
  maxDate = new Date();
  minDate = new Date();

  constructor() {
    this.minDate.setFullYear(this.maxDate.getFullYear() - 18);
  }
  onSubmit(form: NgForm) {
    console.log(form.value);
  }
}
