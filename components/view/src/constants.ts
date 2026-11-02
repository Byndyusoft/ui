import type { ISpacingProps } from './types';

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

export const spacingSideProperties: Record<string, Array<string>> = {
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

export const valuesTokenPattern = /^[A-Za-z0-9_-]+$/;

export const spacingPropsNames = Object.keys(spacingPropPrefixes) as Array<keyof ISpacingProps>;
