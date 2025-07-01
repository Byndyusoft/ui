import { IViewProps, TSpacingUnit } from '@byndyusoft-ui/view/src/View.types';

export const directions = ['row', 'column', 'row-reverse', 'column-reverse'] as const;

export type TFlexDirection = (typeof directions)[number];

export const flexWraps = ['nowrap', 'wrap', 'wrap-reverse'] as const;

export type TFlexWrap = (typeof flexWraps)[number];

export const justifyContentVariants = [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly'
] as const;

export type TJustifyContent = (typeof justifyContentVariants)[number];

export const alignContentVariants = [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
    'stretch'
] as const;

export type TAlignContent = (typeof alignContentVariants)[number];

export const alignItemsVariants = ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const;

export type TAlignItems = (typeof alignItemsVariants)[number];

export interface IFlexProps extends IViewProps {
    alignContent?: TAlignContent;
    alignItems?: TAlignItems;
    direction?: TFlexDirection;
    justifyContent?: TJustifyContent;
    wrap?: TFlexWrap;
    gap?: TSpacingUnit;
    rowGap?: TSpacingUnit;
    columnGap?: TSpacingUnit;
}
