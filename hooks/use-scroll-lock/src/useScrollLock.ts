import { useEffect, useRef } from 'react';

export default function useScrollLock(isLocked?: boolean, target?: HTMLElement | null): void {
    const originalOverflowRef = useRef<string>('');

    useEffect(() => {
        const element = target ?? document.body;

        if (!originalOverflowRef.current) {
            originalOverflowRef.current = window.getComputedStyle(element).overflow;
        }

        if (isLocked) {
            element.style.overflow = 'hidden';
        } else {
            element.style.overflow = originalOverflowRef.current;
        }

        return () => {
            element.style.overflow = originalOverflowRef.current ?? '';
        };
    }, [isLocked, target]);
}
