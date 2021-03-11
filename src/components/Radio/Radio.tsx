import React, { FC } from 'react';
import cn from 'classnames';
import './Radio.css';

interface IRadioProps {
    name: string;
    className?: string;
    isChecked: boolean;
    onChange: (value: boolean) => void;
    isDisabled?: boolean;
    isIndeterminate?: boolean;
}

// ToDo: Add indeterminate state
const Radio: FC<IRadioProps> = ({
    name,
    className,
    isChecked,
    onChange,
    isDisabled,
    isIndeterminate = isChecked === undefined,
    children
}) => (
    <button
        className={cn(className, 'Radio', isDisabled && 'Radio--container-isDisabled')}
        type="button"
        onClick={() => {
            if (!isDisabled) {
                onChange(!isChecked);
            }
        }}
    >
        <input
            name={name}
            type="radio"
            className="Radio--input"
            checked={isChecked}
            onChange={() => {
                onChange(!isChecked);
            }}
        />
        <div
            className={cn(
                'Radio--sphere',
                isChecked && !isDisabled && 'Radio--checked',
                isDisabled && isChecked && 'Radio--isDisabledFilled',
                isDisabled && !isChecked && 'Radio--isDisabled'
            )}
        />
        {children}
    </button>
);

export default Radio;
