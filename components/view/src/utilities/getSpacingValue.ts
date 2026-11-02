import { spacingUnitVariable } from '../constants';

export function getSpacingValue(unit: string, multiplier: number): string {
    return `calc(var(${spacingUnitVariable}, ${unit}) * ${multiplier})`;
}
