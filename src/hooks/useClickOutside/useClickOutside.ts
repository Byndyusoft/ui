import { useCallback, useEffect, useRef } from 'react';


type TUseClickOutsideResponse = [ ref: (e:Element | null) => void ]

const useClickOutside = (onClick: () => void): TUseClickOutsideResponse => {
    const elementRef = useRef<Element | null>(null);

    const handleClick = (e: MouseEvent): void => {
        const target = e.target as Node;
            if (!elementRef.current?.contains(target)) {
                onClick();
            }
    };

    const bindRefHandler = useCallback((e: Element | null) => {
        // Remove listener when changing ref
        if(e && elementRef.current && e !== elementRef.current){
            document.removeEventListener('click', handleClick);
        }
        elementRef.current = e;
    },[elementRef])

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [elementRef]);

    return [bindRefHandler];
};

export default useClickOutside;