import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ContactFormData } from '../../models/contact-form';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ContactFormService } from '../../services/contact-form-service';
import { form, required, FormField, disabled, submit, maxLength, email, pattern } from '@angular/forms/signals';
import { ErrorDialogService } from '../../../../shared/features/error-dialog/services/error-dialog-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ASCII_REGEX, SNACKBAR_SUCCESS } from '../../models/constants';
import { requiredTrimmed } from '../../../../shared/custom-validators/validators';

@Component({
  imports: [MatInputModule, MatFormFieldModule, MatDividerModule, MatButtonModule, FormField, MatProgressBarModule, MatCardModule],
  selector: 'app-contact-form',
  styleUrl: './contact-form.scss',
  templateUrl: './contact-form.html',
})
export class ContactFormComponent {
  private readonly _contactFormService = inject(ContactFormService);
  private readonly _errorDialogService = inject(ErrorDialogService);
  private _snackBar = inject(MatSnackBar);

  public title = signal('Please fill in the form');
  //public isLoading = signal(false);
  public isSubmitting = signal(false);

  private readonly _contactFormModel = signal<ContactFormData>({
    firstName: '',
    lastName: '',
    city: '',
    postalCode: '',
    email: '',
    textArea: ''
  });

  public readonly textAreaMaxLength = signal(2000);

  public contactForm = form(this._contactFormModel, (path) => {

    // Required fields
    requiredTrimmed(path.firstName, 'First name required');
    requiredTrimmed(path.lastName, 'Last name required');
    requiredTrimmed(path.city, 'City is required');

    required(path.postalCode, {
      message: 'Postal code is required'
    });
    required(path.email, {
      message: 'Email is required'
    });

    // Pattern validation
    pattern(path.firstName, ASCII_REGEX, {
      message: 'First name contains invalid characters'
    });

    pattern(path.lastName, ASCII_REGEX, {
      message: 'Last name contains invalid characters'
    });

    pattern(path.city, ASCII_REGEX, {
      message: 'City contains invalid characters'
    });

    pattern(path.postalCode, /^\d{5}$/, {
      message: 'Postal code must contain exactly five digits'
    });

    email(path.email, {
      message: 'Not a valid email'
    });

    // Length validation
    maxLength(path.textArea, this.textAreaMaxLength(), {
      message: 'Maximum of 2000 characters allowed'
    });


    // Submission state
    const fields = [
      path.firstName,
      path.lastName,
      path.city,
      path.postalCode,
      path.email,
      path.textArea
    ];

    fields.forEach((field) => {
      disabled(field, {
        when: () => this.isSubmitting()
      });
    });

  });

  public async submitForm(): Promise<void> {
    if (this.contactForm().invalid()) return;

    this.isSubmitting.set(true);

    try {
      await submit(this.contactForm, async (field) => {
        const rawData: ContactFormData = field().value();
        await this._contactFormService.handlePayload(rawData);
        field().reset();
      });

      this._snackBar.open(SNACKBAR_SUCCESS, 'Close', {
        verticalPosition: 'top',
        duration: 5000
      });

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

  public clearForm(): void {
    this._contactFormModel.set({
      firstName: '',
      lastName: '',
      city: '',
      postalCode: '',
      email: '',
      textArea: ''
    });

    this.contactForm().reset();
  }

}
