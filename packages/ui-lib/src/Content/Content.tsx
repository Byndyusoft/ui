// @ts-ignore
import React, { FC, ReactNode, ReactElement } from 'react'
import renderAsProp from '../utils/renderAsProp';

interface IContentProps {
    as?: ReactNode | ReactElement | string
}

const Content: FC<IContentProps> = (props) => {
    const { children, as = 'div', ...rest } = props;

    return renderAsProp({ as, props: rest, children })
}

export default Content;