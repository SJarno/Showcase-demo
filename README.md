
# Pre-assignment for the UI Developer

The assignment is to create a form using Angular. You can use whatever libraries and packages you would like to build the form.

The assignment can be completed in an online editor such as [CodePen](https://codepen.io/) or added to GitHub, with the repository link sent to us.

## Form Requirements

The form should have inputs for:

- First name
- Last name
- City
- Postal code
- Email address
- Textarea

Only the textarea should be optional. All other fields are mandatory.

All inputs must be accessible.

## Validation

Implement relevant input validations to ensure that no unnecessary or invalid data is submitted for security reasons.

## Styling

Add styling to make the form look nice and accessible.

## Form Submission

Finally, try submitting the form data to the following endpoint:

[https://formsubmituiassignment.free.beeceptor.com](https://formsubmituiassignment.free.beeceptor.com)

Implement appropriate error handling for form submission.

## Testing

Write tests to cover the key requirements mentioned above.

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.7.

---

# Project Implementation

## Overview

This project implements the requested form using Angular and extends the original assignment with additional functionality focused on maintainability, user experience and application architecture.

In addition to the form itself, the implementation includes internationalization, centralized HTTP error handling and automated tests.

## Implemented Features

### Form

- Form built using Angular and Angular Material.
- Required fields for first name, last name, city, postal code and email address.
- Optional message textarea.
- Input validation to prevent invalid form submissions.
- Accessible form controls with appropriate labels and validation feedback.
- Submission to the API endpoint provided in the assignment.
- Loading and error states during form submission.

### Internationalization

- Support for Finnish and English.
- Dedicated language service responsible for managing the active language.
- Translation resources maintained in separate JSON files.
- Language selection through an Angular Material menu.
- Asynchronous loading of translation resources.

### HTTP Error Handling

- Centralized HTTP error handling using an Angular HTTP interceptor.
- Dedicated error dialog service for displaying application-level errors.
- Reusable error handling instead of duplicating error presentation logic across components.
- Separation of HTTP error handling from individual feature implementations.

### User Interface

- Angular Material components.
- Responsive layout.
- Consistent styling and visual presentation.
- Focus on accessibility and usability.

## Technology Stack

- **Angular 22** – Application framework.
- **TypeScript** – Application development.
- **Angular Material** – UI components.
- **RxJS** – Reactive programming and asynchronous operations.
- **Vitest** – Unit testing.
- **SCSS** – Styling.

## Getting Started

### Prerequisites

- Node.js version compatible with Angular 22.
- npm.

### Installation

Clone the repository:

```bash
git clone https://github.com/SJarno/Showcase-demo.git
cd Showcase-demo
```

Install dependencies:

```bash
npm install
```

### Development Server

Start the development server:

```bash
npm start
```

Open your browser at `http://localhost:4200/`.

The application automatically reloads when source files are changed.

### Production Build

Create a production build:

```bash
npm run build
```

### Running Tests

Run the unit tests:

```bash
npm test
```

## Project Structure

The application is organized into feature-specific areas and shared functionality.

The main areas of responsibility include:

- **Form:** Form presentation, input handling, validation and submission.
- **Internationalization:** Language management, translation resources and language selection.
- **Error Handling:** HTTP error interception and centralized error presentation.
- **Shared Functionality:** Reusable services and application-level utilities.

## API Integration

The form submits its data to the external endpoint specified in the original assignment:

[https://formsubmituiassignment.free.beeceptor.com](https://formsubmituiassignment.free.beeceptor.com)

The endpoint is provided by Beeceptor for testing purposes and is not part of this repository.

## Testing

Automated tests are implemented using Vitest and Angular's testing utilities.

The tests cover application functionality, including service behaviour and HTTP request handling.

---

**Developed as a UI Developer showcase project. Readme generated with AI**
