import { useEffect, useState } from 'react';

interface IUseIntersect {
    node?: Element | null;
    onIntersect?: (value: boolean) => void;
    threshold?: number;
}

function useIntersect({ node, onIntersect, threshold = 1 }: IUseIntersect) {
    const [isIntersecting, setIntersecting] = useState<boolean>(false);

    const observer = new window.IntersectionObserver(
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

    useEffect(() => {
        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) {
                observer.unobserve(node);
            }
        };
    }, [node]);

    return { isIntersecting };
}

export default useIntersect;
