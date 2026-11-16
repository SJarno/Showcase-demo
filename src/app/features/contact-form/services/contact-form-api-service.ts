import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ContactFormData, ContactFormPayload } from '../models/contact-form';
import { Observable } from 'rxjs';
import { CONTACT_FORM_API } from '../components/contact-form/api-constants';

@Service()
export class ContactFormApiService {
    private readonly _http = inject(HttpClient);
    private readonly url = CONTACT_FORM_API;

    public submitContactForm(payload: ContactFormPayload): Observable<string> {
        return this._http.post(this.url, payload, { responseType: 'text' });
    }
}
