import { inject, Service } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog-component';
import { ErrorDialogData } from '../models';
import { HttpErrorResponse } from '@angular/common/http';

@Service()
export class ErrorDialogService {
    private readonly _dialog = inject(MatDialog);

    public openErrorDialog(message: string): void {
        this._dialog.open<ErrorDialogComponent, ErrorDialogData>(
            ErrorDialogComponent,
            {
                data: { message },
                width: '400px',
            }
        );
    }

    public handleNonHttpError(error: unknown): void {
        if (error instanceof HttpErrorResponse) {
            return;
        }

        console.error('Unexpected application error:', error);

        this.openErrorDialog(
            'An unexpected error occurred. Please try again.'
        );
    }
}
