import { Firestore, collection, getDocs, addDoc } from '@angular/fire/firestore';
import { inject, Injectable } from "@angular/core";
import { Exercise } from "./excercise.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

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
      this.exercisesChanged.next(this.availableExercises);
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

  startExercise(exerciseId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === exerciseId) || null;
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
    if (!this.runningExercise) return;
    this.addDataToDatabase({
      ...this.runningExercise,
      Duration: this.runningExercise.Duration,
      calories: this.runningExercise.calories,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    if (!this.runningExercise) return;
    this.addDataToDatabase({
      ...this.runningExercise,
      Duration: this.runningExercise.Duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  private async addDataToDatabase(exercise: Exercise) {
    try {
      const finishedExercisesCollection = collection(this.firestore, 'finishedExercises');
      await addDoc(finishedExercisesCollection, exercise);
      console.log('✅ Exercise added to finishedExercises');
      // Refresh local cache after adding
      await this.fetchFinishedExercises();
    } catch (error) {
      console.error('❌ Error adding exercise to database:', error);
    }
  }

  async fetchFinishedExercises(): Promise<void> {
    try {
      const finishedCollection = collection(this.firestore, 'finishedExercises');
      const snapshot = await getDocs(finishedCollection);
      const data: Exercise[] = snapshot.docs.map(doc => {
        const payload: any = doc.data();
        return {
          id: doc.id ?? payload?.id ?? '',
          Name: payload?.name ?? payload?.Name ?? '',
          Duration: payload?.duration ?? payload?.Duration ?? 0,
          calories: payload?.calories ?? 0,
          date: payload?.date
            ? (typeof payload.date === 'string'
                ? new Date(payload.date)
                : payload.date.toDate?.() ?? new Date(payload.date))
            : undefined,
          state: payload?.state ?? null
        } as Exercise;
      });

      this.finishedExercisesChanged.next(data);
    } catch (error) {
      console.error('❌ Error fetching finished exercises:', error);
    }
  }
}
