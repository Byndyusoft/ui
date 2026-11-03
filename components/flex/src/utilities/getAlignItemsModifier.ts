import { getFlexBlockClassName } from '../constants';
import type { TAlignItems } from '../types';

export function getAlignItemsModifier(alignItems?: TAlignItems, classPrefix = 'bsui'): string {
    return alignItems ? `${getFlexBlockClassName(classPrefix)}--ai-${alignItems}` : '';
}
