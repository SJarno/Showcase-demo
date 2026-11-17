import { validate } from '@angular/forms/signals';

export function requiredTrimmed(
  path: any,
  message = 'This field is required'
): void {
  validate(path, ({ value }) => {
    const fieldValue = value();

    if (
      typeof fieldValue === 'string' &&
      fieldValue.trim().length === 0
    ) {
      return {
        kind: 'required',
        message
      };
    }

    return null;
  });
}