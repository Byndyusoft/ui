import { footnoteTypes, footnoteValueSizeMods } from './footnoteEntities';

type TValueOf<T> = T[keyof T];

export interface IFootnote {
    type: TValueOf<typeof footnoteTypes>;
    value?: string;
    valueSizeModifier?: TValueOf<typeof footnoteValueSizeMods> | null;
    className?: string;
}

export interface INumberData {
    number: number;
    footnote?: IFootnote;
}

export interface INumberViewProps {
    numbersData: Array<INumberData>;
    formatterOptions?: Intl.NumberFormatOptions;
    className?: string;
    shouldRenderInline?: boolean;
}
