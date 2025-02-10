import React from 'react';
import { IRadioGroupProps } from '../RadioGroup.types';
import { RadioGroupContextProvider } from './RadioGroupContext';

const RadioGroup = ({ name, value, children, onChange }: IRadioGroupProps): JSX.Element => (
    <RadioGroupContextProvider name={name} value={value} onChange={onChange}>
        {children}
    </RadioGroupContextProvider>
);

export default RadioGroup;
