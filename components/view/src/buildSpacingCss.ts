import { ISpacingProps, IViewConfig, TSpacingGrid } from './LayoutConfig.types';

export const spacingUnitVariable = '--bsui-unit';

export const spacingPropPrefixes: Record<keyof ISpacingProps, string> = {
    margin: 'm',
    marginTop: 'mt',
    marginRight: 'mr',
    marginBottom: 'mb',
    marginLeft: 'ml',
    marginHorizontal: 'mh',
    marginVertical: 'mv',
    padding: 'p',
    paddingTop: 'pt',
    paddingRight: 'pr',
    paddingBottom: 'pb',
    paddingLeft: 'pl',
    paddingHorizontal: 'ph',
    paddingVertical: 'pv'
};

const spacingSideProperties: Record<string, Array<string>> = {
    m: ['margin'],
    mt: ['margin-top'],
    mr: ['margin-right'],
    mb: ['margin-bottom'],
    ml: ['margin-left'],
    mh: ['margin-left', 'margin-right'],
    mv: ['margin-top', 'margin-bottom'],
    p: ['padding'],
    pt: ['padding-top'],
    pr: ['padding-right'],
    pb: ['padding-bottom'],
    pl: ['padding-left'],
    ph: ['padding-left', 'padding-right'],
    pv: ['padding-top', 'padding-bottom']
};

export function getSpacingClassName(prefix: string, token: string): string {
    return `bsui-${prefix}-${token}`;
}

export function getSpacingValue(unit: string, multiplier: number): string {
    return `calc(var(${spacingUnitVariable}, ${unit}) * ${multiplier})`;
}

export function buildSpacingCss<TGrid extends TSpacingGrid>(config: IViewConfig<TGrid>): string {
    const rules: Array<string> = [];

    Object.entries(config.grid).forEach(([token, multiplier]) => {
        const value = getSpacingValue(config.unit, multiplier);

        Object.entries(spacingSideProperties).forEach(([prefix, properties]) => {
            const declarations = properties.map(property => `${property}:${value}`).join(';');

            rules.push(`.${getSpacingClassName(prefix, token)}{${declarations}}`);
        });
    });

    return rules.join('');
}
