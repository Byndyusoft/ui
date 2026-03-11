import { createContext, useContext } from 'react';

interface ICheckBoxContext {
    id: string;
    isChecked: boolean;
    isDisabled: boolean;
    isIndeterminate: boolean;
}

const CheckBoxContext = createContext<ICheckBoxContext | null>(null);

export function useCheckBox(): ICheckBoxContext | null {
    const context = useContext(CheckBoxContext);

    if (!context) {
        throw new Error('useCheckBox must be used within the CheckBoxContext.Provider');
    }

    return context;
}

export default CheckBoxContext;
