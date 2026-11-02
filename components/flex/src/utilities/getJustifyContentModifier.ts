import { blockClassName } from '../constants';
import type { TJustifyContent } from '../types';

export function getJustifyContentModifier(justifyContent?: TJustifyContent): string {
    return justifyContent ? `${blockClassName}--jc-${justifyContent}` : '';
}
