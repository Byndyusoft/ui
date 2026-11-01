import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { ITextAreaProps } from './TextArea.types';
import useTextAreaAutoHeight from './hooks/useTextAreaAutoHeight';
import useTextAreaChangeCallbacks from './hooks/useTextAreaChangeCallbacks';

const TextArea = forwardRef<HTMLTextAreaElement, ITextAreaProps>(
    (
        {
            isDisabled = false,
            withAutoHeight = false,
            onChange,
            onDebouncedChange,
            debounceDelay,
            onThrottledChange,
            throttleDelay,
            ...props
        },
        ref
    ) => {
        const [element, setElement] = useState<HTMLTextAreaElement | null>(null);
        const elementRef = useRef<HTMLTextAreaElement | null>(null);
        const handleRef = useCallback((node: HTMLTextAreaElement | null): void => {
            elementRef.current = node;
            setElement(node);
        }, []);

        useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(ref, () => elementRef.current, []);

        useTextAreaAutoHeight(element, withAutoHeight, props.style);

        const handleChange = useTextAreaChangeCallbacks({
            onChange,
            onDebouncedChange,
            debounceDelay,
            onThrottledChange,
            throttleDelay
        });

        return <textarea {...props} disabled={isDisabled} ref={handleRef} onChange={handleChange} />;
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;
