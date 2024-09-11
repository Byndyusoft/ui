import React from 'react';
import { IRadioGroupProps } from '../RadioGroup.types';
import { RadioGroupContextProvider } from './RadioGroupContext';

const RadioGroup = ({ name, value, children }: IRadioGroupProps): JSX.Element => {
    return (
        <RadioGroupContextProvider name={name} value={value}>
            {children}
        </RadioGroupContextProvider>
    );
};

export default RadioGroup;
