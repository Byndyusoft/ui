/** Determines whether an HTTP response status should be treated as successful. */
export type TValidateStatus = (status: number) => boolean;
