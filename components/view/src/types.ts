import { FC, HTMLAttributes, ReactHTML } from 'react';

export type TSpacingValues = Record<string, number>;

export interface IViewConfig<TGrid extends TSpacingValues = TSpacingValues> {
    unit: string;
    values: TGrid;
}

export type TValuesToken<TGrid extends TSpacingValues> = Extract<keyof TGrid, string>;

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

export interface ICreatedViewProps<TGrid extends TSpacingValues>
    extends HTMLAttributes<HTMLElement>,
        ISpacingProps<TValuesToken<TGrid>> {
    as?: keyof ReactHTML;
    className?: string;
}

export interface ICreatedView<TGrid extends TSpacingValues> extends FC<ICreatedViewProps<TGrid>> {
    readonly config: IViewConfig<TGrid>;
}

export interface IViewStyleEntry {
    id: string;
    css: string;
}
