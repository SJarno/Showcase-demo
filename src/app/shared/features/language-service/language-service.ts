import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Language, TranslationDictionary } from './models';

@Service()
export class LanguageService {
    private readonly http = inject(HttpClient);

  private readonly activeLanguage = signal<Language>('en');

  readonly language = this.activeLanguage.asReadonly();

  private readonly translations = new Map<Language, TranslationDictionary>();
  private readonly pendingRequests = new Map<Language, Promise<TranslationDictionary>>();

  async initialize(): Promise<void> {
    await this.setLanguage('en');
  }

  async setLanguage(language: Language): Promise<void> {
    await this.loadLanguage(language);
    this.activeLanguage.set(language);
  }

  translate(key: string): string {
    return this.translations.get(this.activeLanguage())?.[key] ?? key;
  }

  private async loadLanguage(language: Language): Promise<TranslationDictionary> {
    const cached = this.translations.get(language);

    if (cached) {
      return cached;
    }

    const pending = this.pendingRequests.get(language);

    if (pending) {
      return pending;
    }

    const request = firstValueFrom(
      this.http.get<TranslationDictionary>(`i18n/${language}.json`)
    ).then(translations => {
      this.translations.set(language, translations);
      return translations;
    }).finally(() => {
      this.pendingRequests.delete(language);
    });

    this.pendingRequests.set(language, request);

    return request;
  }
}
