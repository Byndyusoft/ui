import React, { FC } from 'react';
import cn from 'classnames';

interface ITextInputProps {
    defaultValue?: string;
    value?: string;
    name: string;
    autoComplete?: 'on' | 'off';
    className?: string;
    inputRef?: (ref: HTMLInputElement) => void;
    onChange?: (value: string) => void;
    onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: FC<ITextInputProps> = ({
    defaultValue,
    value,
    name,
    autoComplete = 'off',
    className,
    inputRef,
    onChange,
    onChangeEvent
}) => {
    return (
        <input
            ref={refInstance => {
                if (inputRef && refInstance) {
                    inputRef(refInstance);
                }
            }}
            className={cn('TextInput', className)}
            autoComplete={autoComplete}
            onChange={e => {
                if (onChangeEvent) {
                    onChangeEvent(e);
                }
                if (onChange) {
                    onChange(e.target.value);
                }
            }}
            name={name}
            defaultValue={defaultValue}
            value={value}
            type="text"
        />
    );
};

export default TextInput;
