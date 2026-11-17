import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form';
import { ContactFormService } from '../../services/contact-form-service';
import { ErrorDialogService } from '../../../../shared/features/error-dialog/services/error-dialog-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_SUCCESS } from '../../models/constants';
import { LanguageService } from '../../../../shared/features/language-service/language-service';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  //http mocks ->
  let contactFormServiceMock: {
    handlePayload: ReturnType<typeof vi.fn>;
  }

  let errorDialogServiceMock: {
    handleNonHttpError: ReturnType<typeof vi.fn>;
  }

  let snackBarMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const languageServiceMock = {
    translate: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'notification.contactSuccess': 'Success: Form sent',
        'common.close': 'Sulje'
      };

      return translations[key] ?? key;
    })
  };

  beforeEach(async () => {
    contactFormServiceMock = {
      handlePayload: vi.fn().mockResolvedValue(undefined)
    };

    errorDialogServiceMock = {
      handleNonHttpError: vi.fn()
    };

    snackBarMock = {
      open: vi.fn()
    };



    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        {
          provide: ContactFormService,
          useValue: contactFormServiceMock
        },
        {
          provide: ErrorDialogService,
          useValue: errorDialogServiceMock
        },
        {
          provide: MatSnackBar,
          useValue: snackBarMock
        },
        {
          provide: LanguageService,
          useValue: languageServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges()
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });

  /* it('should use correct title', () => {
    expect(component.title()).toBe('Please fill in the form');
  }); */

  it('should not be submitting', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  /* initial form values -> */
  it('initial form values empty', () => {
    expect(component.contactForm.firstName().value()).toBe('');
    expect(component.contactForm.lastName().value()).toBe('');
    expect(component.contactForm.city().value()).toBe('');
    expect(component.contactForm.postalCode().value()).toBe('');
    expect(component.contactForm.email().value()).toBe('');
    expect(component.contactForm.textArea().value()).toBe('');
  });

  it('should require the correct fields', () => {
    expect(component.contactForm.firstName().invalid()).toBe(true);
    expect(component.contactForm.lastName().invalid()).toBe(true);
    expect(component.contactForm.city().invalid()).toBe(true);
    expect(component.contactForm.postalCode().invalid()).toBe(true);
    expect(component.contactForm.email().invalid()).toBe(true);

    expect(component.contactForm.textArea().valid()).toBe(true);
  });


  it('form invalid in start', () => {
    expect(component.contactForm().invalid()).toBe(true);
  });

  it('submit disabled in start', () => {
    expect(component.submitDisabled()).toBe(true);
  });

  it('should become valid when all required fields are populated', () => {
    populateValidForm();

    expect(component.contactForm().valid()).toBe(true);
    expect(component.submitDisabled()).toBe(false);
  });

  /* it('Is submitting state to be true when submitting', () => {
    component.submitForm();
    expect(component.isSubmitting()).toBe(true);
  }); */

  it('fields should be enabled initially', () => {
    expect(component.contactForm.firstName().disabled()).toBe(false);
    expect(component.contactForm.lastName().disabled()).toBe(false);
    expect(component.contactForm.city().disabled()).toBe(false);
    expect(component.contactForm.postalCode().disabled()).toBe(false);
    expect(component.contactForm.email().disabled()).toBe(false);
    expect(component.contactForm.textArea().disabled()).toBe(false);
  });

  it('fields disabled while submitting', () => {
    component.isSubmitting.set(true);
    expect(component.contactForm.firstName().disabled()).toBe(true);
    expect(component.contactForm.lastName().disabled()).toBe(true);
    expect(component.contactForm.city().disabled()).toBe(true);
    expect(component.contactForm.postalCode().disabled()).toBe(true);
    expect(component.contactForm.email().disabled()).toBe(true);
    expect(component.contactForm.textArea().disabled()).toBe(true);
  });

  it.each(['', ' ', '   ', '\t', '\n'])(
    'should reject empty or whitespace-only required fields',
    (value) => {
      component.contactForm.firstName().value.set(value);
      component.contactForm.lastName().value.set(value);
      component.contactForm.city().value.set(value);
      component.contactForm.postalCode().value.set(value);
      component.contactForm.email().value.set(value);

      expect(component.contactForm.firstName().invalid()).toBe(true);
      expect(component.contactForm.lastName().invalid()).toBe(true);
      expect(component.contactForm.city().invalid()).toBe(true);
      expect(component.contactForm.postalCode().invalid()).toBe(true);
      expect(component.contactForm.email().invalid()).toBe(true);

      expect(component.contactForm().invalid()).toBe(true);
      expect(component.submitDisabled()).toBe(true);
    }
  );

  it('should accept valid Finnish postal codes', () => {
    component.contactForm.postalCode().value.set('00100');
    expect(component.contactForm.postalCode().valid()).toBe(true);
  });

  it.each([
    '1234',
    '123456',
    'ABCDE',
    '12 34',
    '1234A'
  ])('should reject invalid postal code: %s', (postalCode) => {
    component.contactForm.postalCode().value.set(postalCode);

    expect(component.contactForm.postalCode().invalid()).toBe(true);
  });

  describe('first name validation', () => {
    it.each([
      'Pupu',
      'Mäkelä',
      'Åström',
      'Jean-Luc',
      "O'Connor",
      'Mary Jane',
      'St. John'
    ])('should accept valid name: %s', (name) => {
      component.contactForm.firstName().value.set(name);

      expect(component.contactForm.firstName().valid()).toBe(true);
    });

    it.each([
      'John123',
      'Pupu!',
      'Name#',
      'Test$'
    ])('should reject invalid name: %s', (name) => {
      component.contactForm.firstName().value.set(name);

      expect(component.contactForm.firstName().invalid()).toBe(true);
    });
  });

  describe('last name validation', () => {
    it.each([
      'Ankka',
      'Mäkelä',
      'Åström',
      'Jean-Luc',
      "O'Connor",
      'Van Der Berg'
    ])('should accept valid name: %s', (name) => {
      component.contactForm.lastName().value.set(name);

      expect(component.contactForm.lastName().valid()).toBe(true);
    });

    it.each([
      'Ankka123',
      'Name!',
      'Test#',
      'Last$'
    ])('should reject invalid name: %s', (name) => {
      component.contactForm.lastName().value.set(name);

      expect(component.contactForm.lastName().invalid()).toBe(true);
    });
  });

  describe('city validation', () => {
    it.each([
      'Helsinki',
      'Mäntsälä',
      'Äänekoski',
      'Åbo',
      'New York',
      'St. Louis',
      "L'Aquila"
    ])('should accept valid city: %s', (city) => {
      component.contactForm.city().value.set(city);

      expect(component.contactForm.city().valid()).toBe(true);
    });

    it.each([
      'Helsinki123',
      'London!',
      'New York#',
      'City$'
    ])('should reject invalid city: %s', (city) => {
      component.contactForm.city().value.set(city);

      expect(component.contactForm.city().invalid()).toBe(true);
    });
  });


  it('should set isSubmitting to true during submission', async () => {
    populateValidForm();

    let resolvePromise!: () => void;

    contactFormServiceMock.handlePayload.mockReturnValue(
      new Promise<void>((resolve) => {
        resolvePromise = resolve;
      })
    );

    const submission = component.submitForm();

    expect(component.isSubmitting()).toBe(true);

    expect(component.contactForm.firstName().disabled()).toBe(true);
    expect(component.contactForm.lastName().disabled()).toBe(true);

    resolvePromise();
    await submission;

    expect(component.isSubmitting()).toBe(false);
  });

  it('should call service with correct form data', async () => {
    populateValidForm();

    await component.submitForm();

    expect(contactFormServiceMock.handlePayload).toHaveBeenCalledWith({
      firstName: 'Pupu',
      lastName: 'Ankka',
      city: 'Pupulinna',
      postalCode: '00100',
      email: 'pupu.ankka@linnalampi.com',
      textArea: ''
    });
  });

  it('should clear all form fields', () => {
    populateValidForm();

    component.clearForm();

    expect(component.contactForm.firstName().value()).toBe('');
    expect(component.contactForm.lastName().value()).toBe('');
    expect(component.contactForm.city().value()).toBe('');
    expect(component.contactForm.postalCode().value()).toBe('');
    expect(component.contactForm.email().value()).toBe('');
    expect(component.contactForm.textArea().value()).toBe('');
  });

  it('should handle errors and reset submitting state', async () => {
    const error = new Error('Something went wrong');

    populateValidForm();

    contactFormServiceMock.handlePayload.mockRejectedValue(error);

    await component.submitForm();

    expect(errorDialogServiceMock.handleNonHttpError)
      .toHaveBeenCalledWith(error);
    expect(snackBarMock.open).not.toHaveBeenCalled();

    expect(component.isSubmitting()).toBe(false);
  });

  it('should not call service when form is invalid', async () => {
    await component.submitForm();

    expect(contactFormServiceMock.handlePayload).not.toHaveBeenCalled();
  });

  it('should display success snackbar after submission', async () => {
    populateValidForm();

    await component.submitForm();

    expect(snackBarMock.open).toHaveBeenCalledWith(
      SNACKBAR_SUCCESS, 'Sulje', { verticalPosition: 'bottom', duration: 5000 });
  });

  /* Test helper */
  const populateValidForm = () => {
    component.contactForm.firstName().value.set('Pupu');
    component.contactForm.lastName().value.set('Ankka');
    component.contactForm.city().value.set('Pupulinna');
    component.contactForm.postalCode().value.set('00100');
    component.contactForm.email().value.set('pupu.ankka@linnalampi.com');
  };

});
