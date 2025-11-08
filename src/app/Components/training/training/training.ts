import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
export class Training implements OnInit, OnDestroy {
  ongoingTraining = signal(false);
  trainingService = inject(TrainingService);
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.trainingService.exerciseChanged.subscribe(ex => {
      this.ongoingTraining.set(!!ex);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
