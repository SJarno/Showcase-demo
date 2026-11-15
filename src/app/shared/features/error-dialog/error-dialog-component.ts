import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDialogData } from './models';

@Component({
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions,MatDialogModule, MatButtonModule],
  selector: 'app-error-dialog-component',
  styleUrl: './error-dialog-component.scss',
  templateUrl: './error-dialog-component.html',
})
export class ErrorDialogComponent {
  public readonly data = inject<ErrorDialogData>(MAT_DIALOG_DATA)
}
