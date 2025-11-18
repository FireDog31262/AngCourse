import { computed, inject, Injectable, signal } from "@angular/core";
import { Exercise } from "./excercise.model";
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { LoadAvailableExercises, LoadFinishedExercises, PersistExerciseResult } from './training.actions';
import * as UI from '../../shared/ui.actions';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly availableExercisesSignal = signal<Exercise[]>([]);
  private readonly runningExerciseSignal = signal<Exercise | null>(null);
  private readonly finishedExercisesSignal = signal<Exercise[]>([]);

  readonly availableExercises = this.availableExercisesSignal.asReadonly();
  readonly runningExercise = this.runningExerciseSignal.asReadonly();
  readonly finishedExercises = this.finishedExercisesSignal.asReadonly();
  readonly hasActiveTraining = computed(() => this.runningExerciseSignal() !== null);

  private readonly store = inject(Store<fromRoot.State>);
  private readonly userSignal = this.store.selectSignal(fromRoot.getUser);

  fetchAvailableExercises(): void {
    this.store.dispatch(new LoadAvailableExercises());
  }

  startExercise(exerciseId: string) {
    const selectedExercise = this.availableExercisesSignal().find(ex => ex.id === exerciseId) || null;
    this.runningExerciseSignal.set(selectedExercise ? { ...selectedExercise } : null);
  }

  completeExercise() {
    const currentExercise = this.runningExerciseSignal();
    const user = this.userSignal();
    if (!currentExercise || !user) {
      this.store.dispatch(new UI.ShowSnackbar({
        message: 'No active exercise to complete.',
        action: 'Close',
        duration: 4000
      }));
      return;
    }
    this.store.dispatch(new PersistExerciseResult({
      exercise: {
        ...currentExercise,
        Duration: currentExercise.Duration,
        calories: currentExercise.calories,
        date: new Date(),
        state: 'completed',
        userId: user.id
      }
    }));
    this.runningExerciseSignal.set(null);
  }

  cancelExercise(progress: number) {
    const currentExercise = this.runningExerciseSignal();
    const user = this.userSignal();
    if (!currentExercise || !user) {
      this.store.dispatch(new UI.ShowSnackbar({
        message: 'No active exercise to cancel.',
        action: 'Close',
        duration: 4000
      }));
      return;
    }
    this.store.dispatch(new PersistExerciseResult({
      exercise: {
        ...currentExercise,
        Duration: currentExercise.Duration * (progress / 100),
        calories: currentExercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled',
        userId: user.id
      }
    }));
    this.runningExerciseSignal.set(null);
  }

  fetchFinishedExercises(): void {
    this.store.dispatch(new LoadFinishedExercises());
  }

  setAvailableExercises(exercises: Exercise[]): void {
    this.availableExercisesSignal.set(exercises);
  }

  setFinishedExercises(exercises: Exercise[]): void {
    this.finishedExercisesSignal.set(exercises);
  }
}
