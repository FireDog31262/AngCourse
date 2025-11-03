import { Injectable } from "@angular/core";
import { Exercise } from "./excercise.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  private exercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExercise: Exercise | null = null;

  getAvailableExercises(): Exercise[] {
    return this.exercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.exercises.find(ex => ex.id === selectedId) || null;
    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    } else {
      this.exerciseChanged.next(null);
    }
  }
}
