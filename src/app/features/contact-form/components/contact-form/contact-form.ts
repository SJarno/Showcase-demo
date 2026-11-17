import { Component, computed, inject, signal } from '@angular/core';
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
import { ASCII_REGEX } from '../../models/constants';
import { requiredTrimmed } from '../../../../shared/custom-validators/validators';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../../shared/features/language-service/language-service';


/**
 * Provides the contact form interface, including field validation,
 * submission handling, and form reset functionality.
 */
@Component({
  imports: [MatInputModule, MatFormFieldModule, MatDividerModule, MatButtonModule, FormField, MatProgressBarModule, MatCardModule, TranslatePipe],
  selector: 'app-contact-form',
  styleUrl: './contact-form.scss',
  templateUrl: './contact-form.html',
})
export class ContactFormComponent {
  private readonly _contactFormService = inject(ContactFormService);
  private readonly _errorDialogService = inject(ErrorDialogService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _langService = inject(LanguageService);

  public isSubmitting = signal(false);

  /**
   * Initial state of the contact form.
   * Used when initializing and clearing the form.
   */
  private readonly _contactFormModel = signal<ContactFormData>({
    firstName: '',
    lastName: '',
    city: '',
    postalCode: '',
    email: '',
    textArea: ''
  });

  public readonly textAreaMaxLength = signal(2000);

  /**
   * Configures the contact form fields and their validation rules.
   *
   * Validation is grouped by responsibility to keep the configuration
   * easy to read and maintain.
   */
  public contactForm = form(this._contactFormModel, (path) => {

    // Required fields
    requiredTrimmed(path.firstName, 'validation.firstNameRequired');
    requiredTrimmed(path.lastName, 'validation.lastNameRequired');
    requiredTrimmed(path.city, 'validation.cityRequired');

    required(path.postalCode, {
      message: 'validation.postalCodeRequired'
    });
    required(path.email, {
      message:'validation.emailRequired'
    });

    // Pattern validation
    pattern(path.firstName, ASCII_REGEX, {
      message: 'validation.firstNamePattern'
    });

    pattern(path.lastName, ASCII_REGEX, {
      message: 'validation.lastNamePattern'
    });

    pattern(path.city, ASCII_REGEX, {
      message: 'validation.cityPattern'
    });

    pattern(path.postalCode, /^\d{5}$/, {
      message: 'validation.postalCodePattern'
    });

    email(path.email, {
      message: 'validation.emailInvalid'
    });

    // Length validation
    maxLength(path.textArea, this.textAreaMaxLength(), {
      message: 'validation.textAreaMaxLength'
    });


    // Prevent editing and re-submitting while the form is being submitted
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

  /**
   * Validates and submits the contact form.
   *
   * Displays a success notification when submission succeeds
   * and delegates unexpected errors to the error dialog service.
   */
  public async submitForm(): Promise<void> {
    if (this.contactForm().invalid()) return;

    this.isSubmitting.set(true);

    try {
      await submit(this.contactForm, async (field) => {
        const rawData: ContactFormData = field().value();
        const response = await this._contactFormService.handlePayload(rawData);
        console.info(response);
        this.clearForm(); //reset only on success /no-error
      });

      ;
      this._snackBar.open(this._langService.translate('notification.contactSuccess'), this._langService.translate('common.close'), {
        verticalPosition: 'bottom',
        duration: 5000
      });

    } catch (error) {
      console.error(error);
      this._errorDialogService.handleNonHttpError(error); //http errors are handled globally
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Determines whether the submit button should be disabled.
   *
   * Submission is prevented when the form is invalid
   * or a submission is already in progress.
   */
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
