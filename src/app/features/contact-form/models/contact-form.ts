/*  */
export interface ContactFormData {
    firstName: string;
    lastName: string;
    city: string;
    postalCode: string;
    email: string;
    textArea: string;
}

export interface ContactFormPayload {
    firstName: string;
    lastName: string;
    city: string;
    postalCode: string;
    email: string;
    textArea?: string;
}

/** For json response*/ 
export interface ContactFormResponse {
  message: string;
  success: boolean;
}
