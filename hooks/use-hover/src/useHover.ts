import { RefObject } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';
import useToggle from '@byndyusoft-ui/use-toggle';

export default function useHover<T extends HTMLElement = HTMLElement>(elementRef: RefObject<T>): boolean {
    const [isHovered, { toLeftValue: enter, toRightValue: leave }] = useToggle(true, false, false);

    useEventListener('mouseenter', enter, elementRef);
    useEventListener('mouseleave', leave, elementRef);

    return isHovered;
}
