import { FC } from 'react';
import { ICreatedViewProps, IViewConfig, TGridToken, TSpacingGrid } from '@byndyusoft-ui/view';
import { TAlignContent, TAlignItems, TFlexDirection, TFlexWrap, TJustifyContent } from './Flex.types';

export interface ICreatedFlexProps<TGrid extends TSpacingGrid> extends ICreatedViewProps<TGrid> {
    alignContent?: TAlignContent;
    alignItems?: TAlignItems;
    direction?: TFlexDirection;
    justifyContent?: TJustifyContent;
    wrap?: TFlexWrap;
    gap?: TGridToken<TGrid>;
    rowGap?: TGridToken<TGrid>;
    columnGap?: TGridToken<TGrid>;
}

export interface ICreatedFlex<TGrid extends TSpacingGrid> extends FC<ICreatedFlexProps<TGrid>> {
    readonly config: IViewConfig<TGrid>;
}
