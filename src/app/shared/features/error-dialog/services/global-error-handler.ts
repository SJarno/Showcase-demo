import { ErrorHandler, inject, Service } from '@angular/core';
import { ErrorDialogService } from './error-dialog-service';

/**
        * Handles uncaught application errors globally.
        *
        * Delegates error presentation to ErrorDialogService
        * and preserves Angular's default error handling.
 */
@Service()
export class GlobalErrorHandler extends ErrorHandler {

    private readonly _errorDialogService = inject(ErrorDialogService);

    /**
        * Handles errors that are not caught by application-level error handling.
        *
        * Logs the error, displays a generic error dialog, and delegates
        * to Angular's default error handler.
        *
        * @param error Unhandled application error.
   */
    public override handleError(error: unknown): void {
        console.error(`An error occured ${error}`);
        console.log('GlobalErrorHandler called:', error);
        this._errorDialogService.openErrorDialog('Something happened');

        super.handleError(error);
    }
}
