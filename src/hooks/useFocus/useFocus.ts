import { useRef, useEffect, useCallback } from 'react';

type TUseFocusResponse = (e: HTMLElement | null) => void;

const useFocus = (): TUseFocusResponse => {
    const ref = useRef<HTMLElement | null>(null);

    const bindRefHandler = useCallback(
        (e: HTMLElement | null) => {
            // Remove listener when changing ref
            if (e && ref.current && e !== ref.current) {
                ref.current.focus();
            }
            ref.current = e;
        },
        [ref]
    );

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, [ref]);

    return bindRefHandler;
};

export default useFocus;
