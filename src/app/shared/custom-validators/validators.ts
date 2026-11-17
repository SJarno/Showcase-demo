import { validate } from '@angular/forms/signals';

/**
 * Validates that a string field contains non-whitespace characters.
 *
 * Treats empty strings and whitespace-only strings as missing values.
 *
 * @param path Form field to validate.
 * @param message Validation error message.
 */
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