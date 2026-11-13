import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactForm, ContactFormData } from '../../models/contact-form';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-contact-form',
  styleUrl: './contact-form.scss',
  templateUrl: './contact-form.html',
})
export class ContactFormComponent {
  public title = signal('Please fill in the form');

  //public isLoading = signal(false);
  public isSubmitting = signal(false);

  private readonly fb = inject(FormBuilder);

  public contactForm: FormGroup<ContactForm> = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]]
  });

  public submitForm(): void {
    if (this.contactForm.invalid) return;

    this.isSubmitting.set(true);
    this.contactForm.disable();
    try {
      console.log('submitting form === ', this.contactForm);
      //todo: api call here
    } catch (error) {

    } finally {
      this.isSubmitting.set(false);
      this.contactForm.enable();
    }

  }

  get submitDisabled(): boolean {
    return this.contactForm.invalid || this.isSubmitting();
  }
}
