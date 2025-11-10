import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private snackbar = inject(MatSnackBar);

  private readonly loadingState = signal(false);
  readonly isLoading = this.loadingState.asReadonly();

  setLoading(isLoading: boolean) {
    this.loadingState.set(isLoading);
  }

  showSnackbar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, {
      duration: duration,
      panelClass: ['snackbar']
    });
  }
}
