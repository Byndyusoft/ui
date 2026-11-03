import { FC, HTMLAttributes, ReactHTML } from 'react';

export type TSpacingValues = Record<string, number>;

export type TSpacingUnit = 'px' | 'rem';

export interface ISpacingStep {
    value: number;
    unit: TSpacingUnit;
}

export interface IViewConfig<TValues extends TSpacingValues = TSpacingValues> {
    step: ISpacingStep;
    values: TValues;
    prefix?: string;
}

export type TValuesToken<TValues extends TSpacingValues> = Extract<keyof TValues, string>;

export interface IResolvedSpacingProps<TToken extends string = string> {
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

export interface ISpacingProps<TToken extends string = string> extends IResolvedSpacingProps<TToken> {
    m?: TToken;
    mt?: TToken;
    mr?: TToken;
    mb?: TToken;
    ml?: TToken;
    mh?: TToken;
    mv?: TToken;
    p?: TToken;
    pt?: TToken;
    pr?: TToken;
    pb?: TToken;
    pl?: TToken;
    ph?: TToken;
    pv?: TToken;
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
