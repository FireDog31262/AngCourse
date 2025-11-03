import { Component, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NewTraining } from "../new-training/new-training";
import { CurrentTraining } from "../current-training/current-training";
import { PastTraining } from '../past-training/past-training';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [MatTabsModule, NewTraining, CurrentTraining, PastTraining],
  templateUrl: './training.html',
  styleUrl: './training.less'
})
export class Training {
  ongoingTraining = signal(false);
}
