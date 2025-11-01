import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NewTraining } from "../new-training/new-training";
import { CurrentTraining } from "../current-training/current-training";
import { PastTraining } from '../past-training/past-training';

@Component({
  selector: 'app-training',
  imports: [MatTabsModule, NewTraining, CurrentTraining, PastTraining],
  templateUrl: './training.html',
  styleUrl: './training.sass'
})
export class Training {

}
