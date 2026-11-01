import React, { forwardRef } from 'react';
import { ITextInputProps } from './TextInput.types';
import useTextInputChangeCallbacks from './hooks/useTextInputChangeCallbacks';

const TextInput = forwardRef<HTMLInputElement, ITextInputProps>(
    (
        {
            type = 'text',
            isDisabled = false,
            onChange,
            onDebouncedChange,
            debounceDelay,
            onThrottledChange,
            throttleDelay,
            ...props
        },
        ref
    ) => {
        const handleChange = useTextInputChangeCallbacks({
            onChange,
            onDebouncedChange,
            debounceDelay,
            onThrottledChange,
            throttleDelay
        });

        return <input {...props} type={type} disabled={isDisabled} ref={ref} onChange={handleChange} />;
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;
