import React from 'react';
import { Meta, Story } from '@storybook/react';
import Overlay from './Overlay';
import './Overlay.css';
import './Overlay.stories.css';

export const DefaultStory: Story = () => <Overlay isOpen>Цвет фона: rgba(0, 0, 0, 0.5)</Overlay>;

DefaultStory.storyName = 'Default';

export const CustomBackgroundColorStory: Story = () => (
    <div className="OverlayCustomBackgroundColorStory">
        <Overlay isOpen>Цвет фона: rgba(30, 30, 130, 0.3)</Overlay>
    </div>
);

CustomBackgroundColorStory.storyName = 'Custom background color';

const meta: Meta = {
    title: 'components/Work in progress/Overlay',
    component: Overlay
};

export default meta;
