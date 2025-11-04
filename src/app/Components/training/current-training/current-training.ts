import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, output, signal } from '@angular/core';
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
export class CurrentTraining implements OnInit, OnDestroy {
 ongoingTraining = signal(true);
 progress = signal(0);
 timer: number | undefined;
 readonly dialog = inject(MatDialog);
 exitTraining = output<void>();
 trainingService = inject(TrainingService);

  ngOnInit() {
    this.startTimer();
  }

  onStop() {
    this.stopTimer();
    const dialogRef = this.dialog.open(StopTrainingDialog, { data: { progress: this.progress() } });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.trainingService.cancelExercise(this.progress());
      } else {
        this.startTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer() {
    this.stopTimer();
    const exercise = this.trainingService.getRunningExercise();
    if (!exercise || typeof exercise.duration !== 'number') {
      // no running exercise available - do not start the timer
      return;
    }
    const step = (exercise.duration / 100) * 1000;
    this.timer = window.setInterval(() => {
      this.progress.set(this.progress() + 5);
      if (this.progress() >= 100) {
        this.stopTimer();
        this.trainingService.completeExercise();
      }
    }, step);
  }

  private stopTimer() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
