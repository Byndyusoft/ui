import React, { FC, createContext, useContext } from 'react';

export interface IModalsManagerContextProps {}

const ModalsManagerContext = createContext<IModalsManagerContextProps>({} as IModalsManagerContextProps);

export function useModalsManager(): IModalsManagerContextProps {
    const context = useContext(ModalsManagerContext);

    if (context === undefined) {
        throw new Error('useModalsManager must be used within the ModalsManager');
    }

    return context;
}

const ModalsManagerProvider: FC = ({ children }) => {
    const contextValue = {};

    return <ModalsManagerContext.Provider value={contextValue}>{ children }</ModalsManagerContext.Provider>;
};

export default ModalsManagerProvider;
