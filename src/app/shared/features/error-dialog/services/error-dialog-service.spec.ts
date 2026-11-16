import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorDialogService } from './error-dialog-service';
import { ErrorDialogComponent } from '../error-dialog-component';
import { ErrorDialogData } from '../models';

describe('ErrorDialogService', () => {
  let service: ErrorDialogService;

  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    dialogMock = {
      open: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ErrorDialogService,
        { provide: MatDialog, useValue: dialogMock }
      ]
    });

    service = TestBed.inject(ErrorDialogService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openErrorDialog', () => {
    it('should open dialog with correct component and configuration', () => {
      const message = 'Something went wrong';

      service.openErrorDialog(message);

      expect(dialogMock.open).toHaveBeenCalledWith(
        ErrorDialogComponent,
        {
          data: { message } satisfies ErrorDialogData,
          width: '400px'
        }
      );
    });
  });

  describe('handleNonHttpError', () => {
    it('should not open dialog when error is HttpErrorResponse', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error'
      });

      const consoleSpy = vi.spyOn(console, 'error');

      service.handleNonHttpError(error);

      expect(dialogMock.open).not.toHaveBeenCalled();
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log unexpected error and open error dialog', () => {
      const error = new Error('Unexpected error');

      const consoleSpy = vi.spyOn(console, 'error');

      service.handleNonHttpError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Unexpected application error:',
        error
      );

      expect(dialogMock.open).toHaveBeenCalledWith(
        ErrorDialogComponent,
        {
          data: {
            message: 'An unexpected error occurred. Please try again.'
          },
          width: '400px'
        }
      );
    });
  });
});