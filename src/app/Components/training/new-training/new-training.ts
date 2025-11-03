import { Component, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-new-training',
  standalone: true,
  imports: [MatCardModule, FlexLayoutModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './new-training.html',
  styleUrl: './new-training.less'
})
export class NewTraining {
  trainingStart = output<void>();
}
