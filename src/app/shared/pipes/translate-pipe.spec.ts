import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../features/language-service/language-service';
import { TranslatePipe } from './translate-pipe';
import { vi } from 'vitest';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;

  const languageServiceMock = {
    translate: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'app.title': 'Contact form',
        'common.submit': 'Submit'
      };

      return translations[key] ?? key;
    })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        { provide: LanguageService, useValue: languageServiceMock }
      ]
    });

    pipe = TestBed.inject(TranslatePipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate an existing key', () => {
    expect(pipe.transform('app.title')).toBe('Contact form');
  });

  it('should return the key when translation is missing', () => {
    expect(pipe.transform('missing.key')).toBe('missing.key');
  });

  it('should call the language service with the provided key', () => {
    pipe.transform('common.submit');

    expect(languageServiceMock.translate).toHaveBeenCalledWith('common.submit');
  });
});