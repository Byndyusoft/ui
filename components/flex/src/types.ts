import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { ICreatedViewProps, IViewConfig, TSpacingValues, TValuesToken } from '@byndyusoft-ui/view';
import type {
    alignContentVariants,
    alignItemsVariants,
    directions,
    flexWraps,
    justifyContentVariants
} from './constants';

export type TFlexDirection = (typeof directions)[number];

export type TFlexWrap = (typeof flexWraps)[number];

export type TJustifyContent = (typeof justifyContentVariants)[number];

export type TAlignContent = (typeof alignContentVariants)[number];

export type TAlignItems = (typeof alignItemsVariants)[number];

export interface ICreatedFlexProps<TValues extends TSpacingValues> extends ICreatedViewProps<TValues> {
    alignContent?: TAlignContent;
    alignItems?: TAlignItems;
    direction?: TFlexDirection;
    justifyContent?: TJustifyContent;
    wrap?: TFlexWrap;
    gap?: TValuesToken<TValues>;
    rowGap?: TValuesToken<TValues>;
    columnGap?: TValuesToken<TValues>;
}

export interface ICreatedFlex<TValues extends TSpacingValues>
    extends ForwardRefExoticComponent<ICreatedFlexProps<TValues> & RefAttributes<HTMLElement>> {
    readonly config: IViewConfig<TValues>;
}
