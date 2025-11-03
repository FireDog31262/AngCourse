import { afterNextRender, Component, ElementRef, inject, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TrainingService } from '../training.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  standalone: true,
  imports: [MatCardModule, FlexLayoutModule, MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './new-training.html',
  styleUrl: './new-training.less'
})
export class NewTraining {
  trainingService = inject(TrainingService);
  availableExercises = this.trainingService.getAvailableExercises();
  selected = new FormControl('', [Validators.required]);

  matSelect = viewChild.required<MatSelect>(MatSelect);

  constructor() {
    afterNextRender(() => {
      const select = this.matSelect();
      select.focus();
    });
  }

  startExercise(exerciseId: string) {
    this.trainingService.startExercise(exerciseId);
  }
}
