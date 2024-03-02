import { RefObject, useEffect } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';
import useToggle from '@byndyusoft-ui/use-toggle';

export default function useFocus<T extends HTMLElement = HTMLElement>(
    elementRef: RefObject<T>,
    defaultState = false
): boolean {
    const [isFocused, { toLeftValue: focus, toRightValue: blur }] = useToggle(true, false, defaultState);

    useEffect(() => {
        if (elementRef.current && defaultState) {
            elementRef.current.focus();
        }
    }, []);

    useEventListener('focus', focus, elementRef);
    useEventListener('blur', blur, elementRef);

    return isFocused;
}
