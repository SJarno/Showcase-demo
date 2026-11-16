import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { ContactFormApiService } from './contact-form-api-service';
import { ContactFormPayload } from '../models/contact-form';
import { CONTACT_FORM_API } from '../components/contact-form/api-constants';

describe('ContactFormApiService', () => {
  let service: ContactFormApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactFormApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ContactFormApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request with correct URL and payload', () => {
    const payload: ContactFormPayload = {
      firstName: 'Pupu',
      lastName: 'Ankka',
      city: 'Helsinki',
      postalCode: '00100',
      email: 'pupu@example.com',
      textArea: 'Hello!'
    };

    service.submitContactForm(payload).subscribe();

    const request = httpTestingController.expectOne(CONTACT_FORM_API);

    expect(request.request.method).toBe('POST');
    expect(request.request.url).toBe(CONTACT_FORM_API);
    expect(request.request.body).toEqual(payload);

    request.flush('Success');
  });

  it('should return the response as text', () => {
    const payload: ContactFormPayload = {
      firstName: 'Pupu',
      lastName: 'Ankka',
      city: 'Helsinki',
      postalCode: '00100',
      email: 'pupu@example.com',
      textArea: ''
    };

    let response: string | undefined;

    service.submitContactForm(payload).subscribe(result => {
      response = result;
    });

    const request = httpTestingController.expectOne(CONTACT_FORM_API);

    request.flush('Contact form submitted successfully');

    expect(response).toBe('Contact form submitted successfully');
  });

  it('should propagate HTTP errors', () => {
    const payload: ContactFormPayload = {
      firstName: 'Pupu',
      lastName: 'Ankka',
      city: 'Helsinki',
      postalCode: '00100',
      email: 'pupu@example.com',
      textArea: ''
    };

    let receivedError: unknown;

    service.submitContactForm(payload).subscribe({
      error: error => receivedError = error
    });

    const request = httpTestingController.expectOne(CONTACT_FORM_API);

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(receivedError).toBeTruthy();
    expect((receivedError as { status: number }).status).toBe(500);
  });
});