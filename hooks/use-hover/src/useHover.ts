import { RefObject, useState } from 'react';
import useEventListener from '@byndyusoft-ui/use-event-listener';

export default function useHover<T extends HTMLElement = HTMLElement>(elementRef: RefObject<T>): boolean {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const mouseEnterHandler = () => setIsHovered(true);
    const mouseLeaveHandler = () => setIsHovered(false);

    useEventListener('mouseenter', mouseEnterHandler, elementRef);
    useEventListener('mouseleave', mouseLeaveHandler, elementRef);

    return isHovered;
}
