import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TrainingService } from '../training.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';

@Component({
  selector: 'app-new-training',
  imports: [
    MatCardModule,
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
  protected readonly availableExercises = this.trainingService.availableExercises;
  private readonly store = inject(Store<fromRoot.State>);
  protected readonly isLoading = this.store.selectSignal(fromRoot.getIsLoading);
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
