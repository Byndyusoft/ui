import { HTMLAttributes, ReactHTML } from 'react';

export const magicUnits = [
    'mu025',
    'mu050',
    'mu075',
    'mu100',
    'mu125',
    'mu150',
    'mu200',
    'mu250',
    'mu300',
    'mu350',
    'mu400',
    'mu500',
    'mu600',
    'mu700',
    'mu800',
    'mu900',
    'mu1000'
] as const;

export type TMagicUnit = (typeof magicUnits)[number];

export interface IViewSpacings {
    margin?: TMagicUnit;
    marginTop?: TMagicUnit;
    marginRight?: TMagicUnit;
    marginBottom?: TMagicUnit;
    marginLeft?: TMagicUnit;
    marginHorizontal?: TMagicUnit;
    marginVertical?: TMagicUnit;
    padding?: TMagicUnit;
    paddingTop?: TMagicUnit;
    paddingRight?: TMagicUnit;
    paddingBottom?: TMagicUnit;
    paddingLeft?: TMagicUnit;
    paddingHorizontal?: TMagicUnit;
    paddingVertical?: TMagicUnit;
}

// export interface IViewProps extends Omit<HTMLAttributes<HTMLElement>, 'style'>, IViewSpacings {
export interface IViewProps extends HTMLAttributes<HTMLElement>, IViewSpacings {
    as?: keyof ReactHTML;
    className?: string;
}
