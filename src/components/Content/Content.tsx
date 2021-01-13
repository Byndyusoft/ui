import { ReactNode } from 'react';
import renderAsProp from '../../utils/renderAsProp';

interface IContentProps {
    children: ReactNode;
    as?: string;
}

const Content = (props: IContentProps) => {
    const { children, as = 'div', ...rest } = props;

    return renderAsProp({ as, props: rest, children });
};

export default Content;
