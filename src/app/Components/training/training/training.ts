import { Component, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NewTraining } from "../new-training/new-training";
import { CurrentTraining } from "../current-training/current-training";
import { PastTraining } from '../past-training/past-training';
import { Subscription } from 'rxjs';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [MatTabsModule, NewTraining, CurrentTraining, PastTraining],
  templateUrl: './training.html',
  styleUrl: './training.less'
})
export class Training {
  ongoingTraining = signal(false);
  trainingService = inject(TrainingService);
  sub!: Subscription;

  constructor() {
    this.sub = this.trainingService.exerciseChanged.subscribe(ex => {
      this.ongoingTraining.set(!!ex);
    });
  }
}
