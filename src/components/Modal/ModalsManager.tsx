import React, { FC, createContext, useContext, useState } from 'react';

export type TModalId = string;

export interface IModalsManagerContextProps {
    open: (modalId: TModalId) => void;
    close: (modalId: TModalId) => void;
    isOpen: (modalId: TModalId) => boolean;
}

const ModalsManagerContext = createContext<IModalsManagerContextProps>({} as IModalsManagerContextProps);

export function useModalsManager(): IModalsManagerContextProps {
    const context = useContext(ModalsManagerContext);

    if (context === undefined) {
        throw new Error('useModalsManager must be used within the ModalsManager');
    }

    return context;
}

const ModalsManagerProvider: FC = ({ children }) => {
    const [modals, setModals] = useState<Array<TModalId>>([]);

    const contextValue = {
        open(modalId: TModalId) {
            setModals(previousModals => [...previousModals, modalId]);
        },
        close(modalId: TModalId) {
            setModals(previousModals => previousModals.filter(m => m !== modalId));
        },
        isOpen(modalId: TModalId) {
            console.log('isOpen');
            return modals.includes(modalId);
        }
    };

    return <ModalsManagerContext.Provider value={contextValue}>{children}</ModalsManagerContext.Provider>;
};

export default ModalsManagerProvider;
