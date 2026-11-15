import { ErrorHandler, inject, Service } from '@angular/core';
import { ErrorDialogService } from './error-dialog-service';

@Service()
export class GlobalErrorHandler extends ErrorHandler {

    private readonly _errorDialogService = inject(ErrorDialogService);

    public override handleError(error: any): void {
        console.error(`An error occured ${error}`);
        console.log('GlobalErrorHandler called:', error);
        this._errorDialogService.openErrorDialog('Something happened');

        super.handleError(error);
    }
}
