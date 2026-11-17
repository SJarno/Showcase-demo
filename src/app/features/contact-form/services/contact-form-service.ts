import { inject, Service } from '@angular/core';
import { ContactFormData, ContactFormPayload } from '../models/contact-form';
import { ContactFormApiService } from './contact-form-api-service';
import { firstValueFrom } from 'rxjs';
import { removeWhiteSpace } from '../../../shared/utils/helpers';

/**
 * Busnisess service. Handles contact form data preparation and submission.
 *
 * Normalizes user input before delegating the payload
 * to the contact form API service.
 */
@Service()
export class ContactFormService {
    private readonly _apiService = inject(ContactFormApiService);

    /**
   * Normalizes contact form data and submits it to the API.
   *
   * Trims surrounding whitespace from text fields and removes
   * all whitespace from the postal code.
   * 
   * As the api is not known to us currently we are asuming unknown.
   *
   * @param formData Raw contact form data.
   * @returns Promise that resolves when the API request completes.
   */
    public handlePayload(formData: ContactFormData): Promise<unknown> {
        const normalizedPayload: ContactFormPayload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            city: formData.city.trim(),
            postalCode: removeWhiteSpace(formData.postalCode),
            email: formData.email.trim(),
            textArea: formData.textArea.trim()
        };

        return firstValueFrom(this._apiService.submitContactFormText(normalizedPayload));
    }
}


