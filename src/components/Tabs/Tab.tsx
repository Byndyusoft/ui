import React, { FC } from 'react';
import './Tabs.css';

export interface ITabProps {
    onClick?: () => void;
}

const Tab: FC<ITabProps> = ({ children, onClick = () => {} }) => {
    return (
        <button type="button" className="Tab" onClick={() => onClick()}>
            {children}
        </button>
    );
};

export default Tab;
