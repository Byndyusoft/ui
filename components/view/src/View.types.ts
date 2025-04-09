import { HTMLAttributes, ReactHTML } from 'react';

export const spacingUnits = [
    'su025',
    'su050',
    'su075',
    'su100',
    'su125',
    'su150',
    'su200',
    'su250',
    'su300',
    'su350',
    'su400',
    'su500',
    'su600',
    'su700',
    'su800',
    'su900',
    'su1000'
] as const;

export type TSpacingUnit = (typeof spacingUnits)[number];

export interface IViewSpacings {
    margin?: TSpacingUnit;
    marginTop?: TSpacingUnit;
    marginRight?: TSpacingUnit;
    marginBottom?: TSpacingUnit;
    marginLeft?: TSpacingUnit;
    marginHorizontal?: TSpacingUnit;
    marginVertical?: TSpacingUnit;
    padding?: TSpacingUnit;
    paddingTop?: TSpacingUnit;
    paddingRight?: TSpacingUnit;
    paddingBottom?: TSpacingUnit;
    paddingLeft?: TSpacingUnit;
    paddingHorizontal?: TSpacingUnit;
    paddingVertical?: TSpacingUnit;
}

// export interface IViewProps extends Omit<HTMLAttributes<HTMLElement>, 'style'>, IViewSpacings {
export interface IViewProps extends HTMLAttributes<HTMLElement>, IViewSpacings {
    as?: keyof ReactHTML;
    className?: string;
}
