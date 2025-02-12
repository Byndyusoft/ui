import React, { forwardRef } from 'react';
import cn from 'classnames';
import { IInputProps } from './input.types';
import styles from './Input.module.css';

const Input = forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
    const {
        size = 'l',
        type = 'text',
        variant = 'unstyled',
        rightComponent,
        leftComponent,
        disabled,
        isInvalid,
        className,
        style,
        inputClassName,
        inputStyle,
        ...otherProps
    } = props;

    const inputContainerClasses = [
        styles.input_container,
        styles[variant],
        styles[size],
        { [styles.disabled]: Boolean(disabled) },
        { [styles.invalid]: Boolean(isInvalid) },
        className
    ];

    const inputClasses = [styles.input, inputClassName];

    return (
        <div className={cn(inputContainerClasses)} style={style}>
            {leftComponent}
            <input
                className={cn(inputClasses)}
                style={inputStyle}
                ref={ref}
                type={type}
                disabled={disabled}
                {...otherProps}
            />
            {rightComponent}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
