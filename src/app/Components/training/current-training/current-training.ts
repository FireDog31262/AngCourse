import { ChangeDetectionStrategy, Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingDialog } from './stop-training-dialog/stop-training-dialog';
import { MatButtonModule } from "@angular/material/button";
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  standalone: true,
  imports: [MatProgressSpinnerModule, FlexLayoutModule, MatButtonModule],
  templateUrl: './current-training.html',
  styleUrl: './current-training.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentTraining implements OnDestroy {
  protected readonly progress = signal(0);
  private timer: number | undefined;
  private readonly dialog = inject(MatDialog);
  private readonly trainingService = inject(TrainingService);

  constructor() {
    effect(() => {
      const exercise = this.trainingService.runningExercise();
      this.stopTimer();
      this.progress.set(0);

      if (!exercise || typeof exercise.Duration !== 'number') {
        return;
      }

      this.startTimer(exercise.Duration);
    });
  }

  onStop() {
    const exercise = this.trainingService.runningExercise();
    if (!exercise || typeof exercise.Duration !== 'number') {
      return;
    }

    this.stopTimer();
    const dialogRef = this.dialog.open(StopTrainingDialog, { data: { progress: this.progress() } });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.trainingService.cancelExercise(this.progress());
      } else {
        this.startTimer(exercise.Duration);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(durationMinutes: number) {
    this.stopTimer();
    const step = (durationMinutes / 100) * 1000;
    this.timer = window.setInterval(() => {
      const next = this.progress() + 5;
      if (next >= 100) {
        this.progress.set(100);
        this.stopTimer();
        this.trainingService.completeExercise();
        return;
      }
      this.progress.set(next);
    }, step);
  }

  private stopTimer() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
