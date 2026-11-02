import { getSpacingValue, IViewConfig, TSpacingGrid } from '@byndyusoft-ui/view';

export const flexModifiersCss = [
    '.bsui-flex{display:flex}',
    '.bsui-flex--fd-row{flex-direction:row}',
    '.bsui-flex--fd-row-reverse{flex-direction:row-reverse}',
    '.bsui-flex--fd-column{flex-direction:column}',
    '.bsui-flex--fd-column-reverse{flex-direction:column-reverse}',
    '.bsui-flex--fw-nowrap{flex-wrap:nowrap}',
    '.bsui-flex--fw-wrap{flex-wrap:wrap}',
    '.bsui-flex--fw-wrap-reverse{flex-wrap:wrap-reverse}',
    '.bsui-flex--jc-flex-start{justify-content:flex-start}',
    '.bsui-flex--jc-flex-end{justify-content:flex-end}',
    '.bsui-flex--jc-center{justify-content:center}',
    '.bsui-flex--jc-space-between{justify-content:space-between}',
    '.bsui-flex--jc-space-around{justify-content:space-around}',
    '.bsui-flex--jc-space-evenly{justify-content:space-evenly}',
    '.bsui-flex--ac-flex-start{align-content:flex-start}',
    '.bsui-flex--ac-flex-end{align-content:flex-end}',
    '.bsui-flex--ac-center{align-content:center}',
    '.bsui-flex--ac-space-between{align-content:space-between}',
    '.bsui-flex--ac-space-around{align-content:space-around}',
    '.bsui-flex--ac-space-evenly{align-content:space-evenly}',
    '.bsui-flex--ac-stretch{align-content:stretch}',
    '.bsui-flex--ai-flex-start{align-items:flex-start}',
    '.bsui-flex--ai-flex-end{align-items:flex-end}',
    '.bsui-flex--ai-center{align-items:center}',
    '.bsui-flex--ai-baseline{align-items:baseline}',
    '.bsui-flex--ai-stretch{align-items:stretch}'
].join('');

export function buildFlexCss<TGrid extends TSpacingGrid>(config: IViewConfig<TGrid>): string {
    const rules: Array<string> = [];

    Object.entries(config.grid).forEach(([token, multiplier]) => {
        const value = getSpacingValue(config.unit, multiplier);

        rules.push(`.bsui-flex--g-${token}{gap:${value}}`);
        rules.push(`.bsui-flex--rg-${token}{row-gap:${value}}`);
        rules.push(`.bsui-flex--cg-${token}{column-gap:${value}}`);
    });

    return rules.join('');
}
