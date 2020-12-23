import { isValidElement, cloneElement, createElement, ReactNode } from 'react';

interface IRenderAsProp<P> {
    as: any; //TODO проверить тип
    props?: P;
    children: ReactNode[] | ReactNode;
}

export default function renderAsProp<P>({ as, props, children }: IRenderAsProp<P>) {
    return isValidElement(as) ? cloneElement(as, props, children) : createElement<P>(as, props, children);
}
