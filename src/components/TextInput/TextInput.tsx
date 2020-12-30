import React, { FC } from 'react';
import { IInputProps } from '../Input';
import Input, { Size, Variant } from '../Input';

interface ITextInputProps extends IInputProps {
    defaultValue?: string;
    value?: string;
    name: string;
    autoComplete?: 'on' | 'off';
    className?: string;
    inputRef?: (ref: HTMLInputElement) => void;
}

const TextInput: FC<ITextInputProps> = ({
    defaultValue,
    value,
    name,
    autoComplete = 'off',
    className,
    placeholder,
    inputRef,
    onChange,
    size = Size.Medium,
    variant = Variant.Regular,
    leftComponent,
    rightComponent,
    isDisabled,
    isInvalid
}) => {
    return (
        <Input
            type="text"
            name={name}
            className={className}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            inputRef={inputRef}
            size={size}
            variant={variant}
            autoComplete={autoComplete}
            onChange={onChange}
            leftComponent={leftComponent}
            rightComponent={rightComponent}
            isInvalid={isInvalid}
            isDisabled={isDisabled}
        />
    );
};

export default TextInput;
