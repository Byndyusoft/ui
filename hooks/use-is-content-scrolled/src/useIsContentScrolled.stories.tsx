import React, { useRef } from 'react';
import type { StoryObj } from '@storybook/react';
import useIsContentScrolled from './useIsContentScrolled';

type TStory = StoryObj<typeof Template>;

const contentStyle: React.CSSProperties = {
    border: '1px solid #d9d9d9',
    height: 160,
    overflow: 'auto',
    padding: 16,
    width: 320
};

const innerContentStyle: React.CSSProperties = {
    height: 360,
    width: 560
};

const Template = (): JSX.Element => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { isScrolledByX, isScrolledByY } = useIsContentScrolled(contentRef);

    return (
        <div>
            <p>Scrolled by x: {String(isScrolledByX)}</p>
            <p>Scrolled by y: {String(isScrolledByY)}</p>
            <div ref={contentRef} style={contentStyle}>
                <div style={innerContentStyle}>
                    Scroll this content horizontally or vertically to update hook state.
                </div>
            </div>
        </div>
    );
};

export const HookStory: TStory = {
    name: 'Hook story',
    render: Template
};

export default {
    title: 'hooks/useIsContentScrolled'
};
