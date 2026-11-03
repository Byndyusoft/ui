import { getSpacingValue, type IViewConfig, type TSpacingValues } from '@byndyusoft-ui/view';
export function buildCss<TValues extends TSpacingValues>(config: IViewConfig<TValues>): string {
    const rules: Array<string> = [];
    const blockClassName = `${config.prefix ?? 'bsui'}-flex`;

    Object.entries(config.values).forEach(([token, multiplier]) => {
        const value = getSpacingValue(config.step, multiplier);

        rules.push(`.${blockClassName}--g-${token}{gap:${value}}`);
        rules.push(`.${blockClassName}--rg-${token}{row-gap:${value}}`);
        rules.push(`.${blockClassName}--cg-${token}{column-gap:${value}}`);
    });

    return rules.join('');
}
