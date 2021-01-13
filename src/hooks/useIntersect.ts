import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';

interface IUseIntersect {
    threshold?: number | number[];
}

type TUseIntersectResponse = { node: Dispatch<SetStateAction<Element | null>>; isIntersecting: boolean };

function useIntersect({ threshold = 1 }: IUseIntersect): TUseIntersectResponse {
    const [isIntersecting, setIntersecting] = useState<boolean>(false);
    // Check for browser Intersection API support
    const getIntersectionAPI = () => {
        if (window.IntersectionObserver) {
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
        } else {
            if (isIntersecting === false) {
                setIntersecting(true);
            }
            return null;
        }
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

    return { node: setNode, isIntersecting };
}

export default useIntersect;
