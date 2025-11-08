import { afterNextRender, Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TrainingService } from '../training.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Exercise } from '../excercise.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  standalone: true,
  imports: [MatCardModule, FlexLayoutModule, MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './new-training.html',
  styleUrl: './new-training.less'
})
export class NewTraining implements OnInit, OnDestroy {
  trainingService = inject(TrainingService);
  availableExcercises = signal<Exercise[]>([]);
  selected = new FormControl('', [Validators.required]);

  matSelect = viewChild.required<MatSelect>(MatSelect);

  private subscription?: Subscription;

  constructor() {
    afterNextRender(() => {
      const select = this.matSelect();
      select.focus();
    });
  }

  ngOnInit(): void {
    this.subscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.availableExcercises.set(exercises);
    });
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  startExercise(exerciseId: string) {
    this.trainingService.startExercise(exerciseId);
  }
}
