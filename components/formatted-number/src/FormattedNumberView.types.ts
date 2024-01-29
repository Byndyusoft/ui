export interface IFormattedNumberViewProps {
    number: number;
    formatterOptions?: Intl.NumberFormatOptions;
    classNames?: {
        container?: string;
        space?: string;
    };
}
