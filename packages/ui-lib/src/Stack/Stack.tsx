import React, { FC } from 'react'
import cn from 'classnames';
import '@byndyusoft-ui/styles/Stack/Stack.css';
// import './Stack.css';

interface IStackProps {
    className?: string
}

const Stack: FC<IStackProps> = ({className, children}) => {
    return (
        <div className={cn(className, 'Stack')}>
            {children}
        </div>
    )
}

export default Stack
