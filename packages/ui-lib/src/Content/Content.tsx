import React, { FC, ReactNode, createElement, ReactElement } from 'react'
import renderAsProp from '../utils/renderAsProp';

interface iContentProps {
    as?: ReactNode | ReactElement
}

const Content: FC = (props) => {
    const { children, as = 'div', ...rest } = props;

    return renderAsProp({ as, props: rest, children })
}

export default Content;