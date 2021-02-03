import React, { FC } from 'react';
import { useTabContext } from './Tabs';

export interface ITabContent {
    index: number;
    className?: string;
}

const TabContent: FC<ITabContent> = ({ children, className, index }) => {
    const { currentTabIndex } = useTabContext();

    if (currentTabIndex !== index) {
        return null;
    }

    return <div className={className}>{children}</div>;
};

export default TabContent;
