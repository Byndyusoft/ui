import { getFlexBlockClassName } from '../constants';
import type { TFlexWrap } from '../types';

export function getWrapModifier(wrap?: TFlexWrap, classPrefix = 'bsui'): string {
    return wrap ? `${getFlexBlockClassName(classPrefix)}--fw-${wrap}` : '';
}
