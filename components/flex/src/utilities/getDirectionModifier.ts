import { blockClassName } from '../constants';
import type { TFlexDirection } from '../types';

export function getDirectionModifier(direction?: TFlexDirection): string {
    return direction ? `${blockClassName}--fd-${direction}` : '';
}
