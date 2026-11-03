import { RefObject, useCallback, useRef, useState } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';
import useIsomorphicLayoutEffect from '@byndyusoft-ui/use-isomorphic-layout-effect';

const isBrowser = typeof window !== 'undefined';

const getXPosition = (target?: RefObject<HTMLElement>): number => {
    if (!isBrowser) {
        return 0;
    }

    if (!target) {
        return window.scrollX || window.pageXOffset || 0;
    }

    return target.current?.scrollLeft ?? 0;
};

const getYPosition = (target?: RefObject<HTMLElement>): number => {
    if (!isBrowser) {
        return 0;
    }

    if (!target) {
        return window.scrollY || window.pageYOffset || 0;
    }

    return target.current?.scrollTop ?? 0;
};

// RTL containers can report negative scrollLeft when scrolled horizontally.
const getIsScrolledByX = (position: number): boolean => position !== 0;

const getIsScrolledByY = (position: number): boolean => position > 0;

interface IUseIsContentScrolledState {
    isScrolledByX: boolean;
    isScrolledByY: boolean;
}

export default function useIsContentScrolled(target?: RefObject<HTMLElement>): IUseIsContentScrolledState {
    const windowFallbackRef = useRef<HTMLElement>(null);
    const scrollTarget = target ?? windowFallbackRef;
    const scrollXPosition = useRef(getXPosition(target));
    const scrollYPosition = useRef(getYPosition(target));

    const [state, setState] = useState<IUseIsContentScrolledState>({
        isScrolledByX: getIsScrolledByX(scrollXPosition.current),
        isScrolledByY: getIsScrolledByY(scrollYPosition.current)
    });

    const scrollHandler = useCallback((): void => {
        const xPos = getXPosition(target);
        const yPos = getYPosition(target);

        const hasXScroll = getIsScrolledByX(xPos);
        const hasYScroll = getIsScrolledByY(yPos);
        const hasPrevXScroll = getIsScrolledByX(scrollXPosition.current);
        const hasPrevYScroll = getIsScrolledByY(scrollYPosition.current);

        scrollXPosition.current = xPos;
        scrollYPosition.current = yPos;

        if (hasXScroll !== hasPrevXScroll || hasYScroll !== hasPrevYScroll) {
            setState({
                isScrolledByX: hasXScroll,
                isScrolledByY: hasYScroll
            });
        }
    }, [target]);

    useIsomorphicLayoutEffect(() => {
        scrollHandler();
    }, [scrollHandler]);

    useEventListener('scroll', scrollHandler, scrollTarget);

    return state;
}
