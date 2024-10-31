import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import usePortal from './usePortalContainer';
import { IPortalProps } from './Portal.types';

const Portal: FC<PropsWithChildren<IPortalProps>> = ({ children, id, targetElement }) => {
    const { container } = usePortal({ id, targetElement });

    return createPortal(children, container);
};

export default Portal;
