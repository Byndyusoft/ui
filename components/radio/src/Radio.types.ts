import { ReactNode } from "react";

export type TOnChange = (value: string) => void;

export interface IRadioProps {
    value: string;
    label?: string;
    children?: ReactNode;
}

export interface IRadioGroupProps {
    value: string;
    children: ReactNode;
    name: string;
    onChange?: TOnChange;
}

export interface IUseRadioGroupState {
    name: string;
    value: string;
    onChange?: TOnChange;
}

export interface IRadioGroupState {
    name: string;
    value: string;
    setValue: (value: string) => void;
}

export interface IRadioGroupContextProviderProps {
    name: string;
    value: string;
    children: ReactNode
    onChange?: TOnChange;
}