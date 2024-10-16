import React, { ReactNode } from 'react';
import cn from 'classnames';

import { ICheckBoxLabelClassNames } from '../CheckBox.types';
import { useCheckBox } from './CheckBoxContext';

export interface ICheckBoxLabelProps {
    children: ReactNode;
    className?: string;
    classNames?: ICheckBoxLabelClassNames;
}

const CheckBoxLabel = ({ children, className, classNames }: ICheckBoxLabelProps): JSX.Element => {
    const context = useCheckBox();

    const classes = cn(classNames?.main, context?.isDisabled && classNames?.disabled, className);

    return <div className={classes}>{children}</div>;
};

export default CheckBoxLabel;
