import React, { FC, ReactElement, useState, createContext } from 'react';
import { ITabContent } from './TabContent';
// eslint-disable-next-line import/no-cycle
import { ITabsListProps } from './TabsList';

type TTabsChildren = Array<ReactElement<ITabsListProps | ITabContent>>;

export interface ITabsProps {
    children: TTabsChildren;
}

export interface ITabsContext {}

export const TabsContext = createContext({});

const Tabs: FC<ITabsProps> = ({ children }) => {
    const [currentTabIndex, setCurrentTabIndex] = useState(0);

    console.log(children);

    return (
        <TabsContext.Provider
            value={{
                currentTabIndex,
                setIndex: (i: number) => {
                    setCurrentTabIndex(i);
                }
            }}
        >
            i{currentTabIndex}
            {children}
        </TabsContext.Provider>
    );
};

export default Tabs;
