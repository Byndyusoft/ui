import { useEffect } from 'react';

export default function useBodyScrollLock(isLocked?: boolean): void {
    useEffect(() => {
        const originalOverflow = window.getComputedStyle(document.body).overflow;

        if (isLocked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = originalOverflow;
        }

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isLocked]);
}
