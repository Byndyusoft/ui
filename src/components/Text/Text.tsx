import React, { FC } from 'react';
import cn from 'classnames';
import './Text.css';

interface ITextProps {
    className?: string;
    component?: JSX.Element;
    type?: 'title' | 'h1' | 'h2' | 'h3' | 'caps' | 'caption' | 'body';
}

const Text: FC<ITextProps> = ({ className, component, type = 'body', children }) => {
    if (component && React.isValidElement(component)) {
        return React.cloneElement(component, [className, type], children);
    }

    return <div className={cn(className, 'Text', `Text--${type}`)}>{children}</div>;
};

export default Text;
