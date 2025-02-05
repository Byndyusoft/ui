import React, { FC, useCallback, useEffect } from 'react';
import cn from 'classnames';
import useIsMounted from '@byndyusoft-ui/use-is-mounted';
import Portal from '@byndyusoft-ui/portal';
import Overlay from '@byndyusoft-ui/Overlay';
import { useModals, useModalsState } from '@byndyusoft-ui/modals-provider';
import { IModalContainerProps } from '../Modal.types';

const ModalContainer: FC<IModalContainerProps> = ({
    children,
    classNames,
    id,
    onOpen,
    onClose,
    ...props
}): JSX.Element => {
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
            <div className={classNames?.container} role="dialog" tabIndex={-1}>
                <div {...props} className={cn(classNames?.dialog, isOpen && classNames?.isOpen)} role="document">
                    {isOpen && children}
                </div>
            </div>
            <Overlay className={classNames?.overlay} isVisible={isOpen} fixed={true} onClick={handleClick} />
        </Portal>
    );
};

export default ModalContainer;
