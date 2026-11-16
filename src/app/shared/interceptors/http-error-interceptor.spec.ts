import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { httpErrorInterceptor } from './http-error-interceptor';
import { ErrorDialogService } from '../features/error-dialog/services/error-dialog-service';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  let errorDialogServiceMock: {
    openErrorDialog: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    errorDialogServiceMock = {
      openErrorDialog: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([httpErrorInterceptor])
        ),
        provideHttpClientTesting(),
        {
          provide: ErrorDialogService,
          useValue: errorDialogServiceMock
        }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(http).toBeTruthy();
  });

  it('should display error dialog for server error', () => {
    http.get('/api/test').subscribe({
      error: () => { }
    });

    const request = httpTestingController.expectOne('/api/test');

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(errorDialogServiceMock.openErrorDialog).toHaveBeenCalledWith(
      'A server error occurred. Please try again later.'
    );
  });

  it('should not display dialog for bad request', () => {
    http.get('/api/test').subscribe({
      error: () => { }
    });

    const request = httpTestingController.expectOne('/api/test');

    request.flush('Bad request', {
      status: 400,
      statusText: 'Bad Request'
    });

    expect(errorDialogServiceMock.openErrorDialog).not.toHaveBeenCalled();
  });

  it('should not display dialog when status should not trigger global dialog', () => {
    http.get('/api/test').subscribe({
      error: () => { }
    });

    const request = httpTestingController.expectOne('/api/test');

    request.flush('Not found', {
      status: 404,
      statusText: 'Not Found'
    });

    // This assumes shouldShowGlobalErrorDialog returns false for 404.
    expect(errorDialogServiceMock.openErrorDialog).not.toHaveBeenCalled();
  });

  it('should display dialog for too many requests', () => {
    http.get('/api/test').subscribe({
      error: () => { }
    });

    const request = httpTestingController.expectOne('/api/test');

    request.flush('Too many requests', {
      status: 429,
      statusText: 'Too Many Requests'
    });

    expect(errorDialogServiceMock.openErrorDialog).toHaveBeenCalledWith(
      'Too many requests. Please wait a moment and try again.'
    );
  });

  it('should propagate HTTP error to caller', () => {
    let receivedError: unknown;

    http.get('/api/test').subscribe({
      error: error => receivedError = error
    });

    const request = httpTestingController.expectOne('/api/test');

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(receivedError).toBeInstanceOf(HttpErrorResponse);
    expect((receivedError as HttpErrorResponse).status).toBe(500);
  });
});