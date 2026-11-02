import { getSpacingValue, type IViewConfig, type TSpacingValues } from '@byndyusoft-ui/view';
import { blockClassName } from '../constants';

export function buildCss<TValues extends TSpacingValues>(config: IViewConfig<TValues>): string {
    const rules: Array<string> = [];

    Object.entries(config.values).forEach(([token, multiplier]) => {
        const value = getSpacingValue(config.unit, multiplier);

        rules.push(`.${blockClassName}--g-${token}{gap:${value}}`);
        rules.push(`.${blockClassName}--rg-${token}{row-gap:${value}}`);
        rules.push(`.${blockClassName}--cg-${token}{column-gap:${value}}`);
    });

    return rules.join('');
}
