import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ContactFormData } from '../../models/contact-form';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ContactFormService } from '../../services/contact-form-service';
import { form, required, FormField, disabled, submit, maxLength, email } from '@angular/forms/signals';
import { ErrorDialogService } from '../../../../shared/features/error-dialog/services/error-dialog-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import { SNACKBAR_SUCCESS } from '../../models/constants';

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
    required(path.firstName, {
      message: 'First name required'
    });

    required(path.lastName, {
      message: 'Last name required'
    });

    required(path.city, {
      message: 'City is required'
    });

    required(path.postalCode, {
      message: 'Postal code is required'
    });

    required(path.email, {
      message: 'Email is required'
    });
    email(path.email, { message: 'Not a valid email' });

    maxLength(path.textArea, this.textAreaMaxLength(), {
      message: 'Maximun of 2000 characters allowed'
    });

    disabled(path.firstName, {
      when: () => this.isSubmitting()
    });

    disabled(path.lastName, {
      when: () => this.isSubmitting()
    });

    disabled(path.city, {
      when: () => this.isSubmitting()
    });

    disabled(path.postalCode, {
      when: () => this.isSubmitting()
    });

    disabled(path.email, {
      when: () => this.isSubmitting()
    });

    disabled(path.textArea, {
      when: () => this.isSubmitting()
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
