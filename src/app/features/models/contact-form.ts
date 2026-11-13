import { FormControl } from "@angular/forms";

export interface ContactForm {
    firstName: FormControl<string>;
}

export interface ContactFormData {
    firstName: string;
}
