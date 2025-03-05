import { ReactNode } from 'react';

export type TOnChange = (value: string) => void;

export interface IRadioProps {
    value: string;
    isDisabled?: boolean;
    children: ReactNode;
}

export interface IRadioGroupProps {
    value: string;
    children: ReactNode;
    name: string;
    onChange: TOnChange;
}

export interface IUseRadioGroupStateProps {
    name: string;
    value: string;
    onChange: TOnChange;
}

export interface IUseRadioGroup {
    name: string;
    value: string;
    setValue: (value: string) => void;
}

export interface IRadioGroupContextProviderProps {
    name: string;
    value: string;
    children: ReactNode;
    onChange: TOnChange;
}
