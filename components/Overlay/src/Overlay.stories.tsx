import React from 'react';
import { StoryFn } from '@storybook/react';
import { IOverlayProps } from './Overlay.types';
import Overlay from './Overlay';
import './Overlay.stories.css';

const Template: StoryFn<IOverlayProps> = args => (
    <div className="content">
        <p>Long content to demonstrate scrolling...</p>
        <Overlay {...args}>
            <div className="box">
                <h1>Overlay</h1>
                <p>Text in div overlay</p>
            </div>
        </Overlay>
    </div>
);

export const Controls = Template.bind({});

Controls.args = {
    isVisible: false
};

export default {
    title: 'components/Overlay',
    component: Overlay
};
