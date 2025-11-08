import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { TrainingService } from '../training.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Exercise } from '../excercise.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-past-training',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    DatePipe,
    MatCardModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule, MatIconModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  templateUrl: './past-training.html',
  styleUrl: './past-training.less'
})
export class PastTraining implements OnInit {
  trainingService = inject(TrainingService);
  exercises = new MatTableDataSource<Exercise>(); // = new MatTableDataSource(this.trainingService.getExercises());
  sort = viewChild.required<MatSort>(MatSort);
  paginator = viewChild.required<MatPaginator>(MatPaginator);
  filterInput = viewChild.required<ElementRef<HTMLInputElement>>('filterInput');
  filterValue = '';

  ngOnInit() {
    // Subscribe to finished exercises updates
    this.trainingService.finishedExercisesChanged.subscribe(list => {
      this.exercises.data = list;
    });
    // Initial fetch
    this.trainingService.fetchFinishedExercises();
    this.exercises.sort = this.sort();
    this.exercises.paginator = this.paginator();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue;
    this.exercises.filter = filterValue.trim().toLowerCase();
  }

  clearFilter() {
    this.filterValue = '';
    this.exercises.filter = '';
    this.filterInput().nativeElement.value = '';
  }

}
