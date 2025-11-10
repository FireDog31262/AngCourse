import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TrainingService } from '../training.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiService } from '../../../shared/ui.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-training',
  standalone: true,
  imports: [
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './new-training.html',
  styleUrl: './new-training.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTraining implements OnInit {
  private readonly trainingService = inject(TrainingService);
  private readonly uiService = inject(UiService);
  protected readonly availableExercises = this.trainingService.availableExercises;
  protected readonly isLoading = this.uiService.isLoading;
  selected = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    void this.trainingService.fetchAvailableExercises();
  }

  fetchAvailableExercises() {
    void this.trainingService.fetchAvailableExercises();
  }

  onStartTraining() {
    const exerciseId = this.selected.value;
    if (exerciseId) {
      this.trainingService.startExercise(exerciseId);
    }
  }
}
