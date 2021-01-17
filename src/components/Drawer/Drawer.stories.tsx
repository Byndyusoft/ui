import React from 'react';
import { Meta, Story } from '@storybook/react';
import Drawer from './Drawer';

export const DefaultStory: Story = () => <Drawer />;

DefaultStory.storyName = 'Default';

const meta: Meta = {
    title: 'components/Work in progress/Drawer',
    component: Drawer
};

export default meta;
