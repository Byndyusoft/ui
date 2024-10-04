import React, { createContext, useContext } from 'react';
import { IRadioGroupContextProviderProps, IUseRadioGroup } from '../RadioGroup.types';
import useRadioGroupState from '../useRadioGroupState';

const RadioGroupContext = createContext<IUseRadioGroup>({} as IUseRadioGroup);

export function useRadioGroupContext(): IUseRadioGroup {
    const context = useContext(RadioGroupContext);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (context === undefined) {
        throw new Error('useRadioGroupContext must be used within the RadioGroupContextProvider');
    }

    return context;
}

export const RadioGroupContextProvider = ({
    name,
    initialValue,
    onChange,
    children
}: IRadioGroupContextProviderProps) => {
    const radioGroupState = useRadioGroupState({ name, initialValue, onChange });

    return <RadioGroupContext.Provider value={radioGroupState}>{children}</RadioGroupContext.Provider>;
};
