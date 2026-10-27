import { TValidateStatus } from '../types';

/** Applies a custom status predicate or accepts the standard successful HTTP status range. */
export function isStatusAccepted(status: number, validateStatus?: TValidateStatus): boolean {
    return validateStatus === undefined ? status >= 200 && status < 300 : validateStatus(status);
}
