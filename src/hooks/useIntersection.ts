import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';

interface IUseIntersection {
    threshold?: number | number[];
}

type TUseIntersectionResponse = [node: Dispatch<SetStateAction<Element | null>>, isIntersecting: boolean];


function useIntersection({ threshold = 0 }: IUseIntersection): TUseIntersectionResponse {
    const [isIntersecting, setIntersecting] = useState<boolean>(false);
    // Check for browser Intersection API support
    const getIntersectionAPI = () => {
        if ('IntersectionObserver' in window) {
            return new window.IntersectionObserver(
                entries => {
                    const firstEntry = entries[0];
                    if (firstEntry.isIntersecting) {
                        setIntersecting(true);
                    } else {
                        setIntersecting(false);
                    }
                },
                {
                    rootMargin: '0px',
                    threshold
                }
            );
        }
        if (!isIntersecting) {
            setIntersecting(true);
        }
        return null;
        
    };

    // Using state for security purposes
    const [node, setNode] = useState<Element | null>(null);
    const observer = useRef<IntersectionObserver | null>(getIntersectionAPI());

    useEffect(() => {
        const { current: currentObserver } = observer;
        if (currentObserver) {
            // disconnect to prevent observing different referred nodes
            currentObserver.disconnect();
            if (node) {
                currentObserver.observe(node);
            }
        }

        return () => {
            if (node && currentObserver) {
                currentObserver.unobserve(node);
            }
        };
    }, [node, threshold]);

    return [setNode, isIntersecting];
}

export default useIntersection;
