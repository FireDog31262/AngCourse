import { provideLocationMocks } from '@angular/common/testing';
import { EnvironmentProviders, Provider, computed, signal, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { reducers } from '../app/app.reducer';
import { AuthService } from '../app/Components/auth/auth.service';
import { TrainingService } from '../app/Components/training/training.service';
import { Exercise } from '../app/Components/training/excercise.model';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

class AuthServiceStub {
  readonly isLoggedIn = signal(false);

  login(): void {}
  logout(): void {}
  registerUser(): void {}
  getUser() {
    return null;
  }
}

class TrainingServiceStub {
  private readonly availableExercisesSignal = signal<Exercise[]>([]);
  private readonly runningExerciseSignal = signal<Exercise | null>(null);
  private readonly finishedExercisesSignal = signal<Exercise[]>([]);

  readonly availableExercises = this.availableExercisesSignal.asReadonly();
  readonly runningExercise = this.runningExerciseSignal.asReadonly();
  readonly finishedExercises = this.finishedExercisesSignal.asReadonly();
  readonly hasActiveTraining = computed(() => this.runningExerciseSignal() !== null);

  fetchAvailableExercises(): Promise<void> {
    return Promise.resolve();
  }

  fetchFinishedExercises(): Promise<void> {
    return Promise.resolve();
  }

  startExercise(): void {}
  completeExercise(): void {}
  cancelExercise(): void {}
}

export type TestingProviders = Array<Provider | EnvironmentProviders>;

export function appTestingProviders(): TestingProviders {
  const matDialogRefStub: Partial<MatDialogRef<unknown>> = {
    close: () => undefined
  };

  const matDialogStub: Partial<MatDialog> = {
    open: () => ({
      afterClosed: () => of(undefined)
    } as MatDialogRef<unknown>)
  };

  return [
    provideZonelessChangeDetection(),
    provideRouter([]),
    provideLocationMocks(),
    provideNoopAnimations(),
    provideStore(reducers),
    { provide: AuthService, useClass: AuthServiceStub },
    { provide: TrainingService, useClass: TrainingServiceStub },
    { provide: Auth, useValue: {} as Auth },
    { provide: Firestore, useValue: {} as Firestore },
    { provide: MatDialog, useValue: matDialogStub as MatDialog },
    { provide: MatDialogRef, useValue: matDialogRefStub as MatDialogRef<unknown> },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ];
}
