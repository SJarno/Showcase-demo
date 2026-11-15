import { inject, Service } from '@angular/core';
import { ContactFormData } from '../models/contact-form';
import { ContactFormApiService } from './contact-form-api-service';
import { firstValueFrom } from 'rxjs';

@Service()
export class ContactFormService {
    private readonly apiServive = inject(ContactFormApiService);

    public handlePayload(payload: ContactFormData): Promise<unknown> {
        console.log(payload);
        return firstValueFrom(this.apiServive.submitContactForm(payload));
    }
}


