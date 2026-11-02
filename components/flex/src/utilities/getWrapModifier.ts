import { blockClassName } from '../constants';
import type { TFlexWrap } from '../types';

export function getWrapModifier(wrap?: TFlexWrap): string {
    return wrap ? `${blockClassName}--fw-${wrap}` : '';
}
