import { footnoteTypes, footnoteValueSizeMods } from './footnoteEntities';

type TValueOf<T> = T[keyof T];

export interface IFootnote {
    type: TValueOf<typeof footnoteTypes>;
    value?: string;
    valueSizeModifier?: TValueOf<typeof footnoteValueSizeMods> | null;
    className?: string;
}

export interface INumberViewProps {
    number: number;
    footnote?: IFootnote;
    formatterOptions?: Intl.NumberFormatOptions;
    className?: string;
}
