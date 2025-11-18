// import { inject } from "@angular/core";
// import { MatSnackBar } from "@angular/material/snack-bar";
import { Action } from "@ngrx/store";

export const START_LOADING = '[UI] START_LOADING';
export const STOP_LOADING = '[UI] STOP_LOADING';

export class StartLoading implements Action {
  readonly type = START_LOADING;
};

export class StopLoading implements Action {
  readonly type = STOP_LOADING;
};

export type UIActions = StartLoading | StopLoading;

export const SHOW_SNACKBAR = '[UI] SHOW_SNACKBAR';

export interface ShowSnackbarPayload {
  message: string;
  action: string;
  duration: number;
}

export class ShowSnackbar implements Action {
  readonly type = SHOW_SNACKBAR;
  constructor(public payload: ShowSnackbarPayload) {}
}
