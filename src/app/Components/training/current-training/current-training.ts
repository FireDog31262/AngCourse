import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, output, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingDialog } from './stop-training-dialog/stop-training-dialog';
import { MatButtonModule } from "@angular/material/button";

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

  ngOnInit() {
    this.startTimer();
  }

  onStop() {
    this.stopTimer();
    const dialogRef = this.dialog.open(StopTrainingDialog, { data: { progress: this.progress() } });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.ongoingTraining.set(false);
        this.progress.set(0);
        this.exitTraining.emit();
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
    this.timer = window.setInterval(() => {
      this.progress.set(this.progress() + 5);
      if (this.progress() >= 100) {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
