import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ContactFormPayload, ContactFormResponse } from '../models/contact-form';
import { Observable } from 'rxjs';
import { CONTACT_FORM_API } from '../api-constants';

/**
 * Handles HTTP communication with the contact form API.
 */
@Service()
export class ContactFormApiService {
    private readonly _http = inject(HttpClient);
    private readonly _url = CONTACT_FORM_API;

    /**
 * Submits the contact form and expects a plain text response.
 *
 * Use this implementation when the backend returns a raw text response
 * instead of a JSON object.
 */
    public submitContactFormText(payload: ContactFormPayload): Observable<string> {
        return this._http.post(this._url, payload, {
            responseType: 'text'
        });
    }

    /**
     * Submits the contact form and expects a JSON response.
     *
     * Use this implementation when the backend returns structured JSON data.
     * The response is typed as ContactFormResponse to provide compile-time
     * type safety when accessing the returned properties.
     * 
     * Currently not implemented
     */
    public submitContactFormJson(payload: ContactFormPayload): Observable<ContactFormResponse> {
        return this._http.post<ContactFormResponse>(this._url, payload);
    }
}
