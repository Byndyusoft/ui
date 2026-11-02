import { blockClassName } from '../constants';
import type { TAlignItems } from '../types';

export function getAlignItemsModifier(alignItems?: TAlignItems): string {
    return alignItems ? `${blockClassName}--ai-${alignItems}` : '';
}
