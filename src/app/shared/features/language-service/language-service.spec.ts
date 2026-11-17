
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { LanguageService } from './language-service';

describe('LanguageService', () => {
  let service: LanguageService;
  let httpMock: HttpTestingController;

  const enTranslations = {
    'app.title': 'Contact form',
    'common.submit': 'Submit'
  };

  const fiTranslations = {
    'app.title': 'Yhteydenottolomake',
    'common.submit': 'Lähetä'
  };

  const svTranslations = {
    'app.title': 'Kontaktformulär',
    'common.submit': 'Skicka'
  };

  beforeEach(() => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LanguageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with English translations', async () => {
    const initialization = service.initialize();

    const request = httpMock.expectOne('i18n/en.json');

    expect(request.request.method).toBe('GET');

    request.flush(enTranslations);

    await initialization;

    expect(service.translate('app.title')).toBe('Contact form');
  });

  it('should switch language to Finnish', async () => {
    const initialization = service.initialize();

    httpMock.expectOne('i18n/en.json').flush(enTranslations);

    await initialization;

    const languageChange = service.setLanguage('fi');

    httpMock.expectOne('i18n/fi.json').flush(fiTranslations);

    await languageChange;

    expect(service.translate('app.title')).toBe('Yhteydenottolomake');
  });

  it('should switch language to Swedish', async () => {
    const initialization = service.initialize();

    httpMock.expectOne('i18n/en.json').flush(enTranslations);

    await initialization;

    const languageChange = service.setLanguage('sv');

    httpMock.expectOne('i18n/sv.json').flush(svTranslations);

    await languageChange;

    expect(service.translate('common.submit')).toBe('Skicka');
  });

  it('should return the key when translation is missing', () => {
    expect(service.translate('missing.key')).toBe('missing.key');
  });

  it('should use cached translations when switching languages', async () => {
    const initialization = service.initialize();

    httpMock.expectOne('i18n/en.json').flush(enTranslations);

    await initialization;

    const firstSwitch = service.setLanguage('fi');

    httpMock.expectOne('i18n/fi.json').flush(fiTranslations);

    await firstSwitch;

    await service.setLanguage('en');

    expect(service.translate('app.title')).toBe('Contact form');

    // No additional HTTP request should have been made.
    httpMock.expectNone('i18n/en.json');
  });

  it('should expose the active language', async () => {
    const initialization = service.initialize();

    httpMock.expectOne('i18n/en.json').flush(enTranslations);

    await initialization;

    expect(service.language()).toBe('en');

    const languageChange = service.setLanguage('fi');

    httpMock.expectOne('i18n/fi.json').flush(fiTranslations);

    await languageChange;

    expect(service.language()).toBe('fi');
  });
});
