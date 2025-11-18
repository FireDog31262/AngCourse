import { Action } from '@ngrx/store';
import { Exercise } from './excercise.model';

export const LOAD_AVAILABLE_EXERCISES = '[Training] Load Available Exercises';
export const LOAD_FINISHED_EXERCISES = '[Training] Load Finished Exercises';
export const PERSIST_EXERCISE_RESULT = '[Training] Persist Exercise Result';

export class LoadAvailableExercises implements Action {
  readonly type = LOAD_AVAILABLE_EXERCISES;
}

export class LoadFinishedExercises implements Action {
  readonly type = LOAD_FINISHED_EXERCISES;
}

export class PersistExerciseResult implements Action {
  readonly type = PERSIST_EXERCISE_RESULT;
  constructor(public payload: { exercise: Exercise }) {}
}

export type TrainingActions =
  | LoadAvailableExercises
  | LoadFinishedExercises
  | PersistExerciseResult;
