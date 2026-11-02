import { FC, HTMLAttributes, ReactHTML } from 'react';

export type TSpacingGrid = Record<string, number>;

export interface IViewConfig<TGrid extends TSpacingGrid = TSpacingGrid> {
    unit: string;
    grid: TGrid;
}

export type TGridToken<TGrid extends TSpacingGrid> = Extract<keyof TGrid, string>;

export interface ISpacingProps<TToken extends string = string> {
    margin?: TToken;
    marginTop?: TToken;
    marginRight?: TToken;
    marginBottom?: TToken;
    marginLeft?: TToken;
    marginHorizontal?: TToken;
    marginVertical?: TToken;
    padding?: TToken;
    paddingTop?: TToken;
    paddingRight?: TToken;
    paddingBottom?: TToken;
    paddingLeft?: TToken;
    paddingHorizontal?: TToken;
    paddingVertical?: TToken;
}

export interface ICreatedViewProps<TGrid extends TSpacingGrid>
    extends HTMLAttributes<HTMLElement>,
        ISpacingProps<TGridToken<TGrid>> {
    as?: keyof ReactHTML;
    className?: string;
}

export interface ICreatedView<TGrid extends TSpacingGrid> extends FC<ICreatedViewProps<TGrid>> {
    readonly config: IViewConfig<TGrid>;
}
