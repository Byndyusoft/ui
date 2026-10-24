/** Returns a non-empty Error message or the provided fallback for unknown error values. */
export function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
}
