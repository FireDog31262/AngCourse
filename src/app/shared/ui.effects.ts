// import { ShowSnackbar } from './ui.reducer';
import { Injectable, inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { SHOW_SNACKBAR, ShowSnackbar } from './ui.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

@Injectable()
export class UiEffects {
  private readonly actions$ = inject(Actions);
  private readonly snackBar = inject(MatSnackBar);

  // Side effect: display snackbar when SHOW_SNACKBAR action is dispatched
  showSnackbar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SHOW_SNACKBAR),
      tap((action: ShowSnackbar) => {
        const { message, action: actionLabel, duration } = action.payload;
        this.snackBar.open(message, actionLabel, {
          duration,
          panelClass: ['snackbar']
        });
      })
    ), { dispatch: false }
  );
}
