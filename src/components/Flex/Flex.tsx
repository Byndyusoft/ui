import React, { FC } from 'react';
import cn from 'classnames';

type TWrap = boolean | 'wrap' | 'nowrap' | 'wrap-reverse';

export interface IFlexProps {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    wrap?: TWrap;
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

function getWrapClass(value: TWrap) {
    if (value === true) {
        return 'flex-wrap';
    }

    if (value === 'nowrap' || value === 'wrap-reverse' || value === 'wrap') {
        return `flex-${value}`;
    }

    return false;
}

const Flex: FC<IFlexProps> = ({ children, direction = 'row', wrap = false, justify = 'flex-start' }) => {
    const styles = {
        flexDirection: direction,
        justifyContent: justify
        // flexWrap: 'wrap'
    };

    return (
        <div className={cn('flex', getWrapClass(wrap))} style={styles}>
            {children}
        </div>
    );
};

export default Flex;
