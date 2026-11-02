import { spacingSideProperties } from '../constants';
import { getSpacingClassName } from './getSpacingClassName';
import { getSpacingValue } from './getSpacingValue';
import { IViewConfig, TSpacingValues } from '../types';

export function buildCss<TGrid extends TSpacingValues>(config: IViewConfig<TGrid>): string {
    const rules: Array<string> = [];

    Object.entries(config.values).forEach(([token, multiplier]) => {
        const value = getSpacingValue(config.unit, multiplier);

        Object.entries(spacingSideProperties).forEach(([prefix, properties]) => {
            const declarations = properties.map(property => `${property}:${value}`).join(';');

            rules.push(`.${getSpacingClassName(prefix, token)}{${declarations}}`);
        });
    });

    return rules.join('');
}
