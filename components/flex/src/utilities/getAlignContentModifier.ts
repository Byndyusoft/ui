import { blockClassName } from '../constants';
import type { TAlignContent } from '../types';

export function getAlignContentModifier(alignContent?: TAlignContent): string {
    return alignContent ? `${blockClassName}--ac-${alignContent}` : '';
}
