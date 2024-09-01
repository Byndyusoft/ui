import React from 'react';
import { Story } from '@storybook/react';
import { IOverlayProps } from './Overlay.types';
import Overlay from './Overlay';
import './Overlay.stories.css';

const Template: Story<IOverlayProps> = args => (
    <div>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
        <p>A lot of text in main app container</p>
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
