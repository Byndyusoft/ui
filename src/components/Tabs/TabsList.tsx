import React, { FC, ReactElement, useContext } from 'react';
// eslint-disable-next-line import/no-cycle
import { TabsContext } from './Tabs';
import { ITabProps } from './Tab';

export interface ITabsListProps {
    onChangeActiveTabs: (index: number) => void;
    children: Array<ReactElement<ITabProps>>;
}

const TabsList: FC<ITabsListProps> = ({ children, onChangeActiveTabs }) => {
    // @ts-expect-error
    const { setIndex } = useContext(TabsContext);

    const tabs = children.map((child, i) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                onClick: () => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    setIndex(i);
                    // onChangeActiveTabs(i);
                }
            });
        }
        return null;
    });

    return <div className="TabsList">{tabs}</div>;
};

export default TabsList;
