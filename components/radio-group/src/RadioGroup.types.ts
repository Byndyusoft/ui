import { ReactNode } from 'react';

export type TOnChange = (value: string) => void;

export interface IRadioProps {
    value: string;
    children: ReactNode;
}

export interface IRadioGroupProps {
    initialValue: string;
    children: ReactNode;
    name: string;
    onChange?: TOnChange;
}

export interface IUseRadioGroupStateProps {
    name: string;
    initialValue: string;
    onChange?: TOnChange;
}

export interface IUseRadioGroup {
    name: string;
    value: string;
    setValue: (value: string) => void;
}

export interface IRadioGroupContextProviderProps {
    name: string;
    initialValue: string;
    children: ReactNode;
    onChange?: TOnChange;
}
