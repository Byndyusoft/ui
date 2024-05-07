import React, { FC, useCallback, useEffect } from 'react';
import cn from 'classnames';
import useIsMounted from '@byndyusoft-ui/use-is-mounted';
import Portal from '@byndyusoft-ui/portal';
import Overlay from '@byndyusoft-ui/Overlay';
import { useModals, useModalsState } from '@byndyusoft-ui/ModalsProvider';
import { IModalContainerProps } from '../Modal.types';

const ModalContainer: FC<IModalContainerProps> = ({ children, id, onOpen, onClose, ...props }): JSX.Element => {
    const { register, unregister, close } = useModals();
    const modals = useModalsState();
    const isMounted = useIsMounted();

    useEffect(() => {
        register(id);

        return () => unregister(id);
    }, [register, unregister, id]);

    const modalState = modals[id];

    const isOpen = modalState === 'opened';

    useEffect(() => {
        if (isMounted) {
            if (modalState === 'opened') {
                onOpen?.();
            }

            if (modalState === 'closed') {
                onClose?.();
            }
        }
    }, [modalState, isMounted, onOpen, onClose]);

    const handleClick = useCallback(() => close(id), [close, id]);

    return (
        <Portal id={`portal-modal-${id}`}>
            <div className="bs-modal" role="dialog" tabIndex={-1}>
                <div {...props} className={cn('bs-modal__dialog', isOpen && 'is-open')} role="document">
                    {isOpen && children}
                </div>
            </div>
            <Overlay isVisible={isOpen} onClick={handleClick} />
        </Portal>
    );
};

export default ModalContainer;
