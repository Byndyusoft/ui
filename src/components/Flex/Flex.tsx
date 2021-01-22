import React, { FC } from 'react';
import cn from 'classnames';
import './Flex.css';

type TWrapValue = boolean | 'wrap' | 'nowrap' | 'wrap-reverse';

type TJustifyValue = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

type TDirectionValue = 'row' | 'column' | 'row-reverse' | 'column-reverse';

type TAlignValue = 'start' | 'end' | 'center' | 'stretch' | 'baseline';

export interface IFlexProps {
    direction?: TDirectionValue;
    wrap?: TWrapValue;
    justify?: TJustifyValue;
    alignContent?: TAlignValue;
    alignItems?: TAlignValue;
}

function getWrapClass(value: TWrapValue): string | boolean {
    if (value === true) {
        return 'flex-wrap';
    }

    if (value === 'nowrap' || value === 'wrap-reverse' || value === 'wrap') {
        return `flex-${value}`;
    }

    return false;
}

function getJustifyClass(value: TJustifyValue): string {
    return `flex-justify-${value}`;
}

function getDirectionValue(value: TDirectionValue): string {
    return `flex-direction-${value}`;
}

function getAlignItemsValue(value: TAlignValue): string {
    return `flex-align-${value}`;
}

function getAlignContentValue(value: TAlignValue): string {
    return `flex-align-content-${value}`;
}

const Flex: FC<IFlexProps> = ({
    children,
    direction = 'row',
    wrap = false,
    justify = 'start',
    alignItems = 'stretch',
    alignContent = 'start'
}) => {
    return (
        <div
            className={cn(
                'flex',
                getWrapClass(wrap),
                getJustifyClass(justify),
                getDirectionValue(direction),
                getAlignItemsValue(alignItems),
                getAlignContentValue(alignContent)
            )}
        >
            {children}
        </div>
    );
};

export default Flex;
