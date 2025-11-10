import { Firestore, collection, getDocs, addDoc } from '@angular/fire/firestore';
import { computed, inject, Injectable, signal } from "@angular/core";
import { Exercise } from "./excercise.model";
import { UiService } from '../../shared/ui.service';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly availableExercisesSignal = signal<Exercise[]>([]);
  private readonly runningExerciseSignal = signal<Exercise | null>(null);
  private readonly finishedExercisesSignal = signal<Exercise[]>([]);

  readonly availableExercises = this.availableExercisesSignal.asReadonly();
  readonly runningExercise = this.runningExerciseSignal.asReadonly();
  readonly finishedExercises = this.finishedExercisesSignal.asReadonly();
  readonly hasActiveTraining = computed(() => this.runningExerciseSignal() !== null);

  private readonly firestore = inject(Firestore);
  private readonly uiService = inject(UiService);

  // Fetch available exercises from Firestore
  async fetchAvailableExercises(): Promise<void> {
    this.uiService.setLoading(true);
    try {
      const exercisesCollection = collection(this.firestore, 'availableExcercises');
       console.log('🔍 Fetching from collection: availableExcercises');

      const querySnapshot = await getDocs(exercisesCollection);
       console.log('📦 Documents found:', querySnapshot.size);

       const availableExercises = querySnapshot.docs.map(doc => {
         console.log('📄 Doc ID:', doc.id, 'Data:', doc.data());
        return {
           id: doc.id,
           ...doc.data()
         };
       }) as Exercise[];

      console.log('✅ Available exercises:', availableExercises);
      this.availableExercisesSignal.set(availableExercises);
      this.uiService.setLoading(false);
    } catch (error) {
      this.uiService.showSnackbar('Fetching exercises failed, please try again later.', 'Close', 5000);
      this.uiService.setLoading(false);
      this.availableExercisesSignal.set([]);
      console.error('❌ Error fetching exercises:', error);
    }
  }

  startExercise(exerciseId: string) {
    const selectedExercise = this.availableExercisesSignal().find(ex => ex.id === exerciseId) || null;
    this.runningExerciseSignal.set(selectedExercise ? { ...selectedExercise } : null);
  }

  completeExercise() {
    const currentExercise = this.runningExerciseSignal();
    if (!currentExercise) return;
    this.addDataToDatabase({
      ...currentExercise,
      Duration: currentExercise.Duration,
      calories: currentExercise.calories,
      date: new Date(),
      state: 'completed'
    });
    this.runningExerciseSignal.set(null);
  }

  cancelExercise(progress: number) {
    const currentExercise = this.runningExerciseSignal();
    if (!currentExercise) return;
    this.addDataToDatabase({
      ...currentExercise,
      Duration: currentExercise.Duration * (progress / 100),
      calories: currentExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExerciseSignal.set(null);
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

      this.finishedExercisesSignal.set(data);
    } catch (error) {
      console.error('❌ Error fetching finished exercises:', error);
    }
  }
}
