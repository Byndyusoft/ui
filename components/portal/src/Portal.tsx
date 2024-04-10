import { FC } from 'react';
import { createPortal } from 'react-dom';
import usePortal from './usePortal';
import { IPortalProps } from './Portal.types';

const Portal: FC<IPortalProps> = ({ children, id }) => {
    const { container } = usePortal({ id });

    return createPortal(children, container);
};

export default Portal;
