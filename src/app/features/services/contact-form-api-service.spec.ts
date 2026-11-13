import { TestBed } from '@angular/core/testing';
import { ContactFormApiService } from './contact-form-api-service';

describe('ContactFormApiService', () => {
  let service: ContactFormApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactFormApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
