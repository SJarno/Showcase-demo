/** open dialog for these status types only*/
export function shouldShowGlobalErrorDialog(status: number): boolean {
    //TODO: rather add to init service on top level
    return (
        status === 0 ||
        status === 408 ||
        status === 429 ||
        status >= 500
    );
}