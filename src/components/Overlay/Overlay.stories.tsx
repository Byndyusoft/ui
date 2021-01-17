import React from 'react';
import { Meta, Story } from '@storybook/react';
import Overlay from './Overlay';
import './Overlay.css';

export const DefaultStory: Story = () => <Overlay>Содержимое оверлея</Overlay>;

DefaultStory.storyName = 'Default';

const meta: Meta = {
    title: 'components/Work in progress/Overlay',
    component: Overlay
};

export default meta;
