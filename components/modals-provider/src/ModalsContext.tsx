import React, { FC, createContext, useContext } from 'react';
import { IModalsProviderActions, TModalsProviderState } from './ModalsProvider.types';
import useModalsProviderState from './useModalsProviderState';

const ModalsActionsContext = createContext<IModalsProviderActions>({} as IModalsProviderActions);

const ModalsStateContext = createContext<TModalsProviderState>({} as TModalsProviderState);

export function useModals(): IModalsProviderActions {
    const context = useContext(ModalsActionsContext);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (context === undefined) {
        throw new Error('useModals must be used within the ModalsProvider');
    }

    return context;
}

export function useModalsState(): TModalsProviderState {
    const context = useContext(ModalsStateContext);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (context === undefined) {
        throw new Error('useModalsState must be used within the ModalsProvider');
    }

    return context;
}

interface IModalsProviderProps {
    children: React.ReactNode;
}

export const ModalsProvider: FC<IModalsProviderProps> = ({ children }) => {
    const [state, actions] = useModalsProviderState();

    return (
        <ModalsStateContext.Provider value={state}>
            <ModalsActionsContext.Provider value={actions}>{children}</ModalsActionsContext.Provider>
        </ModalsStateContext.Provider>
    );
};
