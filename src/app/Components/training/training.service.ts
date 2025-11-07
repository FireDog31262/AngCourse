import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { inject, Injectable } from "@angular/core";
import { Exercise } from "./excercise.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | null = null;
  private exercises: Exercise[] = [];

  private firestore = inject(Firestore);

  // Fetch available exercises from Firestore
  async fetchAvailableExercises(): Promise<void> {
    try {
      const exercisesCollection = collection(this.firestore, 'availableExcercises');
       console.log('🔍 Fetching from collection: availableExcercises');

      const querySnapshot = await getDocs(exercisesCollection);
       console.log('📦 Documents found:', querySnapshot.size);

       this.availableExercises = querySnapshot.docs.map(doc => {
         console.log('📄 Doc ID:', doc.id, 'Data:', doc.data());
         return {
           id: doc.id,
           ...doc.data()
         };
       }) as Exercise[];

       console.log('✅ Available exercises:', this.availableExercises);
      this.exercisesChanged.next([...this.availableExercises]);
    } catch (error) {
       console.error('❌ Error fetching exercises:', error);
    }
  }

  getAvailableExercises(): Exercise[] {
    return this.availableExercises.slice();
  }

  getExercises(): Exercise[] {
    return this.exercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId) || null;
    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    } else {
      this.exerciseChanged.next(null);
    }
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.exercises.push({
       ...this.runningExercise!,
       Duration: this.runningExercise!.Duration,
       calories: this.runningExercise!.calories,
       date: new Date(),
       state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise!,
      Duration: this.runningExercise!.Duration * (progress / 100),
      calories: this.runningExercise!.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
}
