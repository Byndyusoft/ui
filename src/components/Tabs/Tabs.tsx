import React, { FC, useState, createContext, useContext } from 'react';

export interface ITabsContext {
    currentTabIndex: number;
    setIndex: (i: number) => void;
}

export const TabsContext = createContext<ITabsContext | undefined>(undefined);

const Tabs: FC = ({ children }) => {
    const [currentTabIndex, setCurrentTabIndex] = useState(0);

    return (
        <TabsContext.Provider
            value={{
                currentTabIndex,
                setIndex: (i: number) => {
                    setCurrentTabIndex(i);
                }
            }}
        >
            {children}
        </TabsContext.Provider>
    );
};

export function useTabContext(): ITabsContext {
    const context = useContext(TabsContext);

    if (context === undefined) {
        throw new Error('TabsContext using outside of Tabs component');
    }

    return context;
}

export default Tabs;
