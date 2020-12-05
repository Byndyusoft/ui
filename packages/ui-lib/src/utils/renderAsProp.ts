
import React, { isValidElement, cloneElement, createElement, ReactHTML, ReactNode } from 'react';

interface IRenderAsProp<P> {
    as: ReactHTML,
    props?: P,
    children: ReactNode[] | ReactNode
}

export default function renderAsProp({ as, props, children }: IRenderAsProp) {
    return isValidElement(as) ? cloneElement(as, props, children) : createElement(as, props, children) 
}