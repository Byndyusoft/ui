import React, { JSX, ReactNode, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { v4 as guid } from 'uuid';
import cn from 'classnames';

import { ICheckBoxContainerClassNames, ICheckBoxInputProps } from '../CheckBox.types';

import CheckBoxContext from './CheckBoxContext';
import styles from './CheckBoxContainer.module.css';

export interface ICheckBoxContainerProps extends ICheckBoxInputProps {
    children: ReactNode;
    className?: string;
    classNames?: ICheckBoxContainerClassNames;
}

const CheckBoxContainer = forwardRef<HTMLInputElement, ICheckBoxContainerProps>(
    (
        { children, className, classNames, id, isChecked, isDisabled = false, isIndeterminate = false, ...otherProps },
        ref
    ): JSX.Element => {
        const contextValue = useMemo(
            () => ({
                id: id ?? guid(),
                isChecked,
                isDisabled,
                isIndeterminate
            }),
            [id, isChecked, isDisabled, isIndeterminate]
        );

        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        useEffect(() => {
            if (inputRef.current !== null) {
                inputRef.current.indeterminate = contextValue.isIndeterminate;
            }
        }, [contextValue.isIndeterminate]);

        return (
            <CheckBoxContext.Provider value={contextValue}>
                <label
                    className={cn(classNames?.main, contextValue.isDisabled && classNames?.disabled, className)}
                    htmlFor={contextValue.id}
                >
                    <input
                        checked={contextValue.isChecked}
                        className={cn(styles.input, classNames?.input)}
                        disabled={contextValue.isDisabled}
                        id={contextValue.id}
                        ref={inputRef}
                        type="checkbox"
                        {...otherProps}
                    />
                    {children}
                </label>
            </CheckBoxContext.Provider>
        );
    }
);

CheckBoxContainer.displayName = 'CheckBoxContainer';

export default CheckBoxContainer;
