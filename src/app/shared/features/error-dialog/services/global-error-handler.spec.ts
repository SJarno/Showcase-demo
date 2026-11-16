import { TestBed } from '@angular/core/testing';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './global-error-handler';
import { ErrorDialogService } from './error-dialog-service';

describe('GlobalErrorHandler', () => {
  let service: GlobalErrorHandler;

  let errorDialogServiceMock: {
    openErrorDialog: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    errorDialogServiceMock = {
      openErrorDialog: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: ErrorDialogService, useValue: errorDialogServiceMock }
      ]
    });

    service = TestBed.inject(GlobalErrorHandler);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log the error', () => {
    const error = new Error('Something went wrong');

    const errorSpy = vi.spyOn(console, 'error');
    const logSpy = vi.spyOn(console, 'log');

    vi.spyOn(ErrorHandler.prototype, 'handleError').mockImplementation(() => { });

    service.handleError(error);

    expect(errorSpy).toHaveBeenCalledWith(`An error occured ${error}`);
    expect(logSpy).toHaveBeenCalledWith('GlobalErrorHandler called:', error);
  });

  it('should open error dialog', () => {
    const error = new Error('Something went wrong');

    vi.spyOn(ErrorHandler.prototype, 'handleError').mockImplementation(() => { });

    service.handleError(error);

    expect(errorDialogServiceMock.openErrorDialog).toHaveBeenCalledWith(
      'Something happened'
    );
  });

  it('should call the default Angular error handler', () => {
    const error = new Error('Something went wrong');

    const defaultHandlerSpy = vi.spyOn(
      ErrorHandler.prototype,
      'handleError'
    ).mockImplementation(() => { });

    service.handleError(error);

    expect(defaultHandlerSpy).toHaveBeenCalledWith(error);
  });
});