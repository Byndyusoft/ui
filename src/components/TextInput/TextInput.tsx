import React, { FC } from 'react';
import cn from 'classnames';

interface ITextInputProps {
    value: string;
    name: string;
    autoComplete?: 'on' | 'off';
    className?: string;
    onChange?: (value: string) => void;
    onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: FC<ITextInputProps> = ({ value, name, autoComplete = 'off', className, onChange, onChangeEvent }) => {
    return (
        <input
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
            value={value}
            type="text"
        />
    );
};

export default TextInput;
