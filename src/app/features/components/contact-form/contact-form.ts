import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactFormData } from '../../models/contact-form';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ContactFormService } from '../../services/contact-form-service';
import { form, required, FormField, disabled, submit } from '@angular/forms/signals';

@Component({
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatButtonModule, FormField],
  selector: 'app-contact-form',
  styleUrl: './contact-form.scss',
  templateUrl: './contact-form.html',
})
export class ContactFormComponent {
  private readonly contactFormService = inject(ContactFormService);

  public title = signal('Please fill in the form');
  //public isLoading = signal(false);
  public isSubmitting = signal(false);

  private readonly contactFormModel = signal<ContactFormData>({
    firstName: ''
  });

  public contactForm = form(this.contactFormModel, (path) => {
    required(path.firstName, {
      message: 'First name required'
    }),

      disabled(path.firstName, {
        when: () => this.isSubmitting()
      })
  });

  public async submitForm(): Promise<void> {
    this.isSubmitting.set(true);

    try {
      const response = await submit(this.contactForm, async (field) => {
        const rawData: ContactFormData = field().value();
        const apiResponse = await this.contactFormService.handlePayload(rawData);
        console.log('API response:', apiResponse);
      });
      if (response) {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  public submitDisabled = computed(() => {
    const invalid = this.contactForm().invalid();
    const submitting = this.isSubmitting();

    return invalid || submitting;
  });

}
