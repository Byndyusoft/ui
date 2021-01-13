import { useEffect, useState } from 'react';

interface IUseIntersect {
    node?: Element | null;
    onIntersect?: (value: boolean) => void;
    threshold?: number | number[];
}

function useIntersect({ node, onIntersect, threshold = 1 }: IUseIntersect) {
    // If some browsers do not support Intersection Observer API, then return intersected state
    const [isIntersecting, setIntersecting] = useState<boolean>(true);

    let observer: IntersectionObserver | null = null;

    if (window.IntersectionObserverEntry) {
        observer = new window.IntersectionObserver(
            entries => {
                const firstEntry = entries[0];

                if (firstEntry.isIntersecting) {
                    if (onIntersect) {
                        onIntersect(true);
                    }
                    setIntersecting(true);
                } else {
                    if (onIntersect) {
                        onIntersect(false);
                    }
                    setIntersecting(false);
                }
            },
            {
                rootMargin: '0px',
                threshold
            }
        );
    }

    useEffect(() => {
        if (observer) {
            if (node) {
                observer.observe(node);
            }
        }

        return () => {
            if (node && observer) {
                observer.unobserve(node);
            }
        };
    }, [node, observer]);

    return { isIntersecting };
}

export default useIntersect;
