import { inject, Service } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog-component';
import { ErrorDialogData } from '../models';
import { HttpErrorResponse } from '@angular/common/http';

/**
    * Handles displaying error dialogs and handling unexpected application errors.
 */
@Service()
export class ErrorDialogService {
    private readonly _dialog = inject(MatDialog);

    /**
        * Opens an error dialog displaying the provided message.
        *
        * @param message Error message to display.
    */
    public openErrorDialog(message: string): void {
        this._dialog.open<ErrorDialogComponent, ErrorDialogData>(
            ErrorDialogComponent,
            {
                data: { message },
                width: '400px',
            }
        );
    }

    /**
        * Handles unexpected non-HTTP errors.
        *
        * HTTP errors are ignored because they should be handled separately
        * by the relevant HTTP error handling mechanism.
        *
        * @param error Error to inspect and handle.
   */
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
