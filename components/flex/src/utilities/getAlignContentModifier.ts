import { getFlexBlockClassName } from '../constants';
import type { TAlignContent } from '../types';

export function getAlignContentModifier(alignContent?: TAlignContent, classPrefix = 'bsui'): string {
    return alignContent ? `${getFlexBlockClassName(classPrefix)}--ac-${alignContent}` : '';
}
