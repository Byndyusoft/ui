import { footnoteTypes, footnoteValueSizeMods } from './footnoteEntities';

type TValueOf<T> = T[keyof T];

export interface IFootnote {
    type: TValueOf<typeof footnoteTypes>;
    value?: string;
    valueSizeModifier?: TValueOf<typeof footnoteValueSizeMods> | null;
}

export interface IFormattedNumberViewProps {
    number: number;
    footnote?: IFootnote;
    formatterOptions?: Intl.NumberFormatOptions;
    classNames?: {
        container?: string;
        number?: string;
        space?: string;
        footnote?: string;
    };
}
