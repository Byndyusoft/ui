import { useEffect } from 'react';

function useBodyScrollLock(isLocked?: boolean): void {
    useEffect(() => {
        if (isLocked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isLocked]);
}

export default useBodyScrollLock;
