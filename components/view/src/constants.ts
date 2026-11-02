import type { IResolvedSpacingProps, ISpacingProps } from './types';

export const spacingUnitVariable = '--bsui-unit';

export const spacingPropPrefixes: Record<keyof ISpacingProps, string> = {
    margin: 'm',
    m: 'm',
    marginTop: 'mt',
    mt: 'mt',
    marginRight: 'mr',
    mr: 'mr',
    marginBottom: 'mb',
    mb: 'mb',
    marginLeft: 'ml',
    ml: 'ml',
    marginHorizontal: 'mh',
    mh: 'mh',
    marginVertical: 'mv',
    mv: 'mv',
    padding: 'p',
    p: 'p',
    paddingTop: 'pt',
    pt: 'pt',
    paddingRight: 'pr',
    pr: 'pr',
    paddingBottom: 'pb',
    pb: 'pb',
    paddingLeft: 'pl',
    pl: 'pl',
    paddingHorizontal: 'ph',
    ph: 'ph',
    paddingVertical: 'pv',
    pv: 'pv'
};

export const spacingPropAliases: Record<keyof ISpacingProps, keyof IResolvedSpacingProps> = {
    margin: 'margin',
    m: 'margin',
    marginTop: 'marginTop',
    mt: 'marginTop',
    marginRight: 'marginRight',
    mr: 'marginRight',
    marginBottom: 'marginBottom',
    mb: 'marginBottom',
    marginLeft: 'marginLeft',
    ml: 'marginLeft',
    marginHorizontal: 'marginHorizontal',
    mh: 'marginHorizontal',
    marginVertical: 'marginVertical',
    mv: 'marginVertical',
    padding: 'padding',
    p: 'padding',
    paddingTop: 'paddingTop',
    pt: 'paddingTop',
    paddingRight: 'paddingRight',
    pr: 'paddingRight',
    paddingBottom: 'paddingBottom',
    pb: 'paddingBottom',
    paddingLeft: 'paddingLeft',
    pl: 'paddingLeft',
    paddingHorizontal: 'paddingHorizontal',
    ph: 'paddingHorizontal',
    paddingVertical: 'paddingVertical',
    pv: 'paddingVertical'
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
