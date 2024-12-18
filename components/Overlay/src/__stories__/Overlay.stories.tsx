import React from 'react';
import { StoryFn, StoryObj } from '@storybook/react';
import { IOverlayProps } from '../Overlay.types';
import Overlay from '../Overlay';
import './Overlay.stories.css';

const Template: (args: IOverlayProps) => JSX.Element = (args: IOverlayProps) => (
    <div className='container'>
        <div className="content">
            <p>Long content to demonstrate scrolling...</p>
            <Overlay {...args}>
                <div className="box">
                    <h1>Overlay</h1>
                    <p>Text in div overlay</p>
                </div>
            </Overlay>
        </div>
    </div>
);

export const GeneralOverlayStory: StoryObj<typeof Template> = {
    name: 'General overlay view',
    render: Template,
    args: {
        isVisible: false,
        center: true
    }
};

export default {
    title: 'components/Overlay',
    component: Overlay
};
