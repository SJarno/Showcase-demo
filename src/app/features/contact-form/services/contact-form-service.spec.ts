import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContactFormService } from './contact-form-service';
import { ContactFormApiService } from './contact-form-api-service';
import { ContactFormData, ContactFormPayload } from '../models/contact-form';

describe('ContactFormService', () => {
  let service: ContactFormService;

  let apiServiceMock: {
    submitContactFormText: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      submitContactFormText: vi.fn().mockReturnValue(of({ success: true }))
    };

    TestBed.configureTestingModule({
      providers: [
        ContactFormService,
        { provide: ContactFormApiService, useValue: apiServiceMock }
      ]
    });

    service = TestBed.inject(ContactFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should normalize form data and call API service', async () => {
    const formData: ContactFormData = {
      firstName: '  Pupu  ',
      lastName: '  Ankka  ',
      city: '  Helsinki  ',
      postalCode: '  001 00  ',
      email: '  pupu@example.com  ',
      textArea: '  Hello there!  '
    };

    const expectedPayload: ContactFormPayload = {
      firstName: 'Pupu',
      lastName: 'Ankka',
      city: 'Helsinki',
      postalCode: '00100',
      email: 'pupu@example.com',
      textArea: 'Hello there!'
    };

    await service.handlePayload(formData);

    expect(apiServiceMock.submitContactFormText).toHaveBeenCalledWith(
      expectedPayload
    );
  });

  it('should return the API response', async () => {
    const response = { success: true };

    apiServiceMock.submitContactFormText.mockReturnValue(of(response));

    const formData: ContactFormData = {
      firstName: 'Pupu',
      lastName: 'Ankka',
      city: 'Helsinki',
      postalCode: '00100',
      email: 'pupu@example.com',
      textArea: ''
    };

    const result = await service.handlePayload(formData);

    expect(result).toEqual(response);
  });
});