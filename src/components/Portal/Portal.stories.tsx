import React, { CSSProperties } from 'react';
import { Meta, Story } from '@storybook/react';
import Portal from './Portal';

export const DefaultStory: Story = () => {
    const style: CSSProperties = {
        position: 'absolute',
        top: '0',
        right: '0',
        backgroundColor: 'lavender',
        padding: '1rem 2rem'
    };

    return (
        <Portal>
            <div style={style}>Текст в портале</div>
        </Portal>
    );
};

DefaultStory.storyName = 'Default';

const meta: Meta = {
    title: 'components/Work in progress/Portal',
    component: Portal
};

export default meta;
