import { spacingUnitVariable } from '../constants';
import type { ISpacingStep } from '../types';

export function getSpacingValue(stepOrUnit: ISpacingStep | string, multiplier: number): string {
    if (typeof stepOrUnit === 'string') {
        return `calc(var(${spacingUnitVariable}, ${stepOrUnit}) * ${multiplier})`;
    }

    const value = Number((stepOrUnit.value * multiplier).toPrecision(15));

    return `${value}${stepOrUnit.unit}`;
}
