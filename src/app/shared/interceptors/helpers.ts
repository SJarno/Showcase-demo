/** open dialog for these status types only*/
export function shouldShowGlobalErrorDialog(status: number): boolean {
    return (
        status === 0 ||
        status === 408 ||
        status === 429 ||
        status >= 500
    );
}