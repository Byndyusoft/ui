// @ts-ignore
import React, { FC, ReactNode, ReactElement } from 'react';
import cn from 'classnames';
import renderAsProp from '../../utils/renderAsProp';
import { TSize } from '../../constansts';

interface IContentProps {
    as?: ReactNode | ReactElement | string;
    maxWidth?: TSize;
    auto?: boolean;
    className?: string;
}

const Content: FC<IContentProps> = props => {
    const { children, as = 'section', maxWidth = 'Medium', className, auto, ...rest } = props;

    return renderAsProp({
        as,
        props: { className: cn(className, 'Content', `maxWidth${maxWidth}`, auto && 'ContentCenter'), ...rest },
        children
    });
};

export default Content;
