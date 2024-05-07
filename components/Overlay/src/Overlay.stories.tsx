import React from 'react';
import { Story } from '@storybook/react';
import { IOverlayProps } from './Overlay.types';
import Overlay from './Overlay';

const Template: Story<IOverlayProps> = args => <Overlay {...args}>Overlay</Overlay>;

export const Controls = Template.bind({});

Controls.args = {
    isVisible: false
};

export default {
    title: 'components/Overlay',
    component: Overlay
};
