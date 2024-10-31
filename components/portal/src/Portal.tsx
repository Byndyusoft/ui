import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import usePortal from './usePortal';
import { IPortalProps } from './Portal.types';

const Portal: FC<PropsWithChildren<IPortalProps>> = ({ children, id, targetElement }) => {
    if (targetElement) {
        return createPortal(children, targetElement);
    }

    const { container } = usePortal({ id });

    return createPortal(children, container);
};

export default Portal;
