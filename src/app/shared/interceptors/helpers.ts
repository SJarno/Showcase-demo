/**
 * Determines whether an HTTP error should trigger a global error dialog.
 *
 * Global dialogs are reserved for network failures, request timeouts,
 * rate limiting and server-side errors. Other HTTP errors should be
 * handled by the relevant feature or component.
 */
export function shouldShowGlobalErrorDialog(status: number): boolean {
    //TODO: check if other codes are needed
    return (
        status === 0 ||       // Angular error - Network or connection error
        status === 400 ||     // Bad request
        status === 401 ||     // Unauthorized
        status === 403 ||     // Forbidden
        status === 404 ||     // Not found
        status === 408 ||     // Request timeout
        status === 409 ||     // Conflict
        status === 429 ||     // Too many requests
        (status >= 500 && status <= 599) // Server errors
    );
}