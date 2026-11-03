import { getFlexBlockClassName } from '../constants';
import type { TFlexDirection } from '../types';

export function getDirectionModifier(direction?: TFlexDirection, classPrefix = 'bsui'): string {
    return direction ? `${getFlexBlockClassName(classPrefix)}--fd-${direction}` : '';
}
