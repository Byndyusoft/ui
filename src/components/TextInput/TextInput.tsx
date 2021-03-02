import React, { FC } from 'react';
import cn from 'classnames';
import Input, { IInputProps, Size, Variant } from '../Input';
import { CloseIcon } from '../Icon';
import './TextInput.css';

interface ITextInputProps extends IInputProps {
    defaultValue?: string;
    value?: string;
    name: string;
    autoComplete?: 'on' | 'off';
    className?: string;
    inputRef?: (ref: HTMLInputElement) => void;
    clearButton?: boolean;
    onClear?: () => void;
}

const TextInput: FC<ITextInputProps> = props => {
    const {
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
        clearButton = true,
        onClear,
        isDisabled,
        isInvalid,
        ...rest
    } = props;

    const renderClearButton = (): JSX.Element | undefined => {
        if (clearButton) {
            return (
                <button
                    className={cn('TextInput--ClearButton', !value && 'TextInput--ClearButtonHidden')}
                    type="button"
                    onClick={onClear}
                >
                    <CloseIcon fill="#ADB0B2" />
                </button>
            );
        }
        return undefined;
    };

    return (
        <Input
            {...rest}
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
            rightComponent={renderClearButton()}
            isInvalid={isInvalid}
            isDisabled={isDisabled}
        />
    );
};

export default TextInput;
