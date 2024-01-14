import { RefObject, useEffect, useState } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export default function useFocus<T extends HTMLElement = HTMLElement>(
    elementRef: RefObject<T>,
    defaultState = false
): boolean {
    const [isFocused, setIsFocused] = useState(defaultState);

    useEffect(() => {
        if (elementRef.current && defaultState) {
            elementRef.current.focus();
        }
    }, []);

    const onFocus = () => setIsFocused(true);

    const onBlur = () => setIsFocused(false);

    useEventListener('focus', onFocus, elementRef);
    useEventListener('blur', onBlur, elementRef);

    return isFocused;
}
