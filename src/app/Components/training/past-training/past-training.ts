import { Subscription } from 'rxjs';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
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
export class PastTraining implements OnInit, OnDestroy, AfterViewInit {
  trainingService = inject(TrainingService);
  exercises = new MatTableDataSource<Exercise>(); // = new MatTableDataSource(this.trainingService.getExercises());
  sort = viewChild<MatSort>(MatSort);
  paginator = viewChild<MatPaginator>(MatPaginator);
  filterInput = viewChild<ElementRef<HTMLInputElement>>('filterInput');
  filterValue = '';
  Subscription?: Subscription;

  ngOnInit() {
    // Subscribe to finished exercises updates
    this.Subscription = this.trainingService.finishedExercisesChanged.subscribe(list => {
      this.exercises.data = list;
    });
    // Initial fetch
    this.trainingService.fetchFinishedExercises();
  }

  ngAfterViewInit(): void {
    const sortElement = this.sort();
    const paginatorElement = this.paginator();
    if (sortElement) this.exercises.sort = sortElement;
    if (paginatorElement) this.exercises.paginator = paginatorElement;
  }

  ngOnDestroy() {
    this.Subscription?.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue;
    this.exercises.filter = filterValue.trim().toLowerCase();
  }

  clearFilter() {
    this.filterValue = '';
    this.exercises.filter = '';
    const input = this.filterInput();
    if (input) {
      input.nativeElement.value = '';
    }
  }

}
