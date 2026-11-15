import { Component, computed, inject, signal } from '@angular/core';
import { ContactFormData } from '../../models/contact-form';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ContactFormService } from '../../services/contact-form-service';
import { form, required, FormField, disabled, submit } from '@angular/forms/signals';
import { ErrorDialogService } from '../../../../shared/features/error-dialog/services/error-dialog-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  imports: [MatInputModule, MatFormFieldModule, MatDividerModule, MatButtonModule, FormField, MatProgressBarModule],
  selector: 'app-contact-form',
  styleUrl: './contact-form.scss',
  templateUrl: './contact-form.html',
})
export class ContactFormComponent {
  private readonly _contactFormService = inject(ContactFormService);
  private readonly _errorDialogService = inject(ErrorDialogService);

  public title = signal('Please fill in the form');
  //public isLoading = signal(false);
  public isSubmitting = signal(false);

  private readonly _contactFormModel = signal<ContactFormData>({
    firstName: ''
  });

  public contactForm = form(this._contactFormModel, (path) => {
    required(path.firstName, {
      message: 'First name required'
    });

    disabled(path.firstName, {
      when: () => this.isSubmitting()
    });
  });

  public async submitForm(): Promise<void> {
    this.isSubmitting.set(true);

    try {
      const response = await submit(this.contactForm, async (field) => {
        const rawData: ContactFormData = field().value();
        await this._contactFormService.handlePayload(rawData);
        field().reset();
      });

      if (response) {

      }

    } catch (error) {
      console.error(error);
      this._errorDialogService.handleNonHttpError(error);
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
