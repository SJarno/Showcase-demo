import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { Language, TranslationDictionary } from './models';

@Service()
export class LanguageService {
    private readonly _http = inject(HttpClient);

    private readonly _activeLanguage = signal<Language>('en');

    public readonly language = this._activeLanguage.asReadonly();

    private readonly _translations = new Map<Language, TranslationDictionary>();
    private readonly _pendingRequests = new Map<Language, Promise<TranslationDictionary>>();

    public readonly isLoading = signal(false);


    public async initialize(): Promise<void> {
        await this.setLanguage('en');
    }

    public async setLanguage(language: Language): Promise<void> {

        this.isLoading.set(true);
        /* await this.loadLanguage(language);
        this._activeLanguage.set(language); */
        try {
            await this.loadLanguage(language);
            this._activeLanguage.set(language);
        } catch (error) {
            console.error(`Failed to load language: ${language}`, error);
            throw error;
        } finally {
            this.isLoading.set(false);
        }
    }

    public translate(key: string): string {
        return this._translations.get(this._activeLanguage())?.[key] ?? key;
    }

    private async loadLanguage(language: Language): Promise<TranslationDictionary> {
        const cached = this._translations.get(language);

        if (cached) {
            return cached;
        }

        const pending = this._pendingRequests.get(language);

        if (pending) {
            return pending;
        }

        const request = firstValueFrom(
            this._http.get<TranslationDictionary>(`i18n/${language}.json`)
        ).then(translations => {
            this._translations.set(language, translations);
            return translations;
        }).finally(() => {
            this._pendingRequests.delete(language);
        });

        this._pendingRequests.set(language, request);

        return request;
    }
}
