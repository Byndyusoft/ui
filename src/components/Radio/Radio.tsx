import React, { FC } from 'react';
import cn from 'classnames';
import './Radio.css';

interface IRadioProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    isDisabled?: boolean;
    isIndeterminate?: boolean;
}

// ToDo: Add indeterminate state
const Radio: FC<IRadioProps> = ({
    checked,
    onChange,
    isDisabled,
    isIndeterminate = checked === undefined,
    children
}) => (
    <button
        className={cn('Radio', isDisabled && 'Radio--container-isDisabled')}
        type="button"
        onClick={() => {
            if (!isDisabled) {
                onChange(!checked);
            }
        }}
    >
        <div
            className={cn(
                'Radio--sphere',
                checked && !isDisabled && 'Radio--checked',
                isDisabled && checked && 'Radio--isDisabledFilled',
                isDisabled && !checked && 'Radio--isDisabled'
            )}
        />
        {children}
    </button>
);

export default Radio;
