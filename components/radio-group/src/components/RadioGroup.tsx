import React from 'react';
import { IRadioGroupProps } from '../RadioGroup.types';
import { RadioGroupContextProvider } from './RadioGroupContext';

const RadioGroup = ({ name, initialValue, children, onChange }: IRadioGroupProps): JSX.Element => (
    <RadioGroupContextProvider name={name} initialValue={initialValue} onChange={onChange}>
        {children}
    </RadioGroupContextProvider>
);

export default RadioGroup;
