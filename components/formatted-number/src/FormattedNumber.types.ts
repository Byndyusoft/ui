export interface IFormatter {
    format: (number: number) => string;
}

export type TNumberParts = Array<string>;

export interface IFormattedNumberViewProps {
    number: number;
    minusSymbol?: string;
    defaultFormatterOptions?: Intl.NumberFormatOptions;
    formatter?: IFormatter;
    parseNumberToParts?: (numberString: string) => TNumberParts;
    numberPartsDividerClassName?: string;
}
