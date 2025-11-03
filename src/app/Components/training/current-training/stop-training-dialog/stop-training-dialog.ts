import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-stop-training-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './stop-training-dialog.html',
  styleUrl: './stop-training-dialog.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopTrainingDialog {
  readonly data = inject<{ progress: number }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<StopTrainingDialog>);

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
