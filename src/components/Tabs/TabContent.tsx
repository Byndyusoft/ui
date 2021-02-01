import React, { FC } from 'react';

export interface ITabContent {}

const TabContent: FC<ITabContent> = ({ children }) => {
    return <div>{children}</div>;
};

export default TabContent;
