import { ReactNode } from 'react';
import cn from 'classnames';
import renderAsProp from '../../utils/renderAsProp';
import { TSize } from '../../constansts';

interface IContentProps {
    as?: string;
    children: ReactNode;
    maxWidth?: TSize;
    auto?: boolean;
    className?: string;
}

const Content = (props: IContentProps): ReactNode => {
    const { children, as = 'section', maxWidth = 'Medium', className, auto, ...rest } = props;

    return renderAsProp({
        as,
        props: { className: cn(className, 'Content', `maxWidth${maxWidth}`, auto && 'ContentCenter'), ...rest },
        children
    });
};

export default Content;
