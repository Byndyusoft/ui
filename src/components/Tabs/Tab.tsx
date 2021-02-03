import React, { FC } from 'react';
import cn from 'classnames';
import { useTabContext } from './Tabs';
import './Tabs.css';

export interface ITabProps {
    index: number;
    onClick?: () => void;
}

const Tab: FC<ITabProps> = ({ children, index }) => {
    const { currentTabIndex, setIndex } = useTabContext();

    return (
        <button
            type="button"
            className={cn('Tab', currentTabIndex === index && 'Tab--active')}
            onClick={() => setIndex(index)}
        >
            {children}
        </button>
    );
};

export default Tab;
