import { getFlexBlockClassName } from '../constants';
import type { TJustifyContent } from '../types';

export function getJustifyContentModifier(justifyContent?: TJustifyContent, classPrefix = 'bsui'): string {
    return justifyContent ? `${getFlexBlockClassName(classPrefix)}--jc-${justifyContent}` : '';
}
