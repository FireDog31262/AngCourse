import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NewTraining } from "../new-training/new-training";
import { CurrentTraining } from "../current-training/current-training";
import { PastTraining } from '../past-training/past-training';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [MatTabsModule, NewTraining, CurrentTraining, PastTraining],
  templateUrl: './training.html',
  styleUrl: './training.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Training {
  protected readonly trainingService = inject(TrainingService);
  protected readonly ongoingTraining = this.trainingService.hasActiveTraining;
}
