import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorDialogService } from '../features/error-dialog/services/error-dialog-service';
import { catchError, throwError } from 'rxjs';
import { shouldShowGlobalErrorDialog } from './helpers';

/**
 * Intercepts HTTP errors and provides consistent application-wide error handling.
 *
 * Displays a global error dialog for selected HTTP status codes while
 * preserving the original error for further handling by the caller.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorDialogService = inject(ErrorDialogService);


  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred. Please try again.';
      //for common http status types
      if (error.status === 0) {
        message = 'Unable to connect to the server. Check your internet connection and try again.';
      } else if (error.status === 400 || error.status === 422) {
        message = 'The submitted information is invalid. Please check your input.';
      } else if (error.status === 401) {
        message = 'Your session has expired. Please sign in again.';
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = 'The requested resource could not be found.';
      } else if (error.status === 408) {
        message = 'The request timed out. Please try again.';
      } else if (error.status === 409) {
        message = 'This request conflicts with existing data.';
      } else if (error.status === 429) {
        message = 'Too many requests. Please wait a moment and try again.';
      } else if (error.status >= 500) {
        message = 'A server error occurred. Please try again later.';
      }
      
      // Avoid displaying global dialogs for errors handled elsewhere.
      if (shouldShowGlobalErrorDialog(error.status)) {
        errorDialogService.openErrorDialog(message);
      }

      return throwError(() => error);
    })
  );
};
