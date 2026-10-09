import React, { JSX } from 'react';
import cn from 'classnames';

import { ICheckBoxIndicatorClassNames } from '../CheckBox.types';
import { useCheckBox } from './CheckBoxContext';

import CheckIcon from '../assets/check.svg?react';
import IndeterminateIcon from '../assets/indeterminate.svg?react';

export interface ICheckBoxIndicatorProps {
    className?: string;
    classNames?: ICheckBoxIndicatorClassNames;
}

const CheckBoxIndicator = ({ className, classNames }: ICheckBoxIndicatorProps): JSX.Element => {
    const context = useCheckBox();

    const isChecked = Boolean(context?.isChecked);
    const isDisabled = Boolean(context?.isDisabled);
    const isIndeterminate = !isChecked && Boolean(context?.isIndeterminate);

    const containerClassNames = cn(
        classNames?.main,
        isDisabled && classNames?.disabled,
        isChecked && classNames?.checked,
        isIndeterminate && classNames?.indeterminate,
        className
    );

    return (
        <div className={containerClassNames}>
            {isChecked && <CheckIcon />}
            {isIndeterminate && <IndeterminateIcon />}
        </div>
    );
};

export default CheckBoxIndicator;
