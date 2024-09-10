import React, { createContext, useContext } from 'react';
import { IRadioGroupContextProviderProps, IRadioGroupState } from '../Radio.types';
import useRadioGroup from '../useRadioGroup';

const RadioGroupContext = createContext<IRadioGroupState>({} as IRadioGroupState);

export function useRadioGroupContext(): IRadioGroupState {
    const context = useContext(RadioGroupContext);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (context === undefined) {
        throw new Error('useRadioGroupContext must be used within the RadioGroupContextProvider');
    }

    return context;
}

export const RadioGroupContextProvider = ({ name, value, onChange, children }: IRadioGroupContextProviderProps) => {
    const radioGroupState = useRadioGroup({ name, value, onChange });

    return <RadioGroupContext.Provider value={{ ...radioGroupState }}>{children}</RadioGroupContext.Provider>;
};
