import { inject, Service } from '@angular/core';
import { ContactFormData, ContactFormPayload } from '../models/contact-form';
import { ContactFormApiService } from './contact-form-api-service';
import { firstValueFrom } from 'rxjs';
import { removeWhiteSpace } from '../../../shared/utils/helpers';

@Service()
export class ContactFormService {
    private readonly apiServive = inject(ContactFormApiService);

    public handlePayload(formData: ContactFormData): Promise<unknown> {
        const normalizedPayload: ContactFormPayload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            city: formData.city.trim(),
            postalCode: removeWhiteSpace(formData.postalCode),
            email: formData.email.trim(),
            textArea: formData.textArea.trim()
        };

        return firstValueFrom(this.apiServive.submitContactForm(normalizedPayload));
    }
}


