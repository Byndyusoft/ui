import React from 'react';
import cn from 'classnames';
import { StoryObj } from '@storybook/react';
import Portal from './Portal';
import './Portal.stories.css';

const Template = (): JSX.Element => (
    <div className="portalStory">
        <p>Text in main app container</p>
        <Portal id="topRightPortal">
            <div className={cn('portalStory__block', 'portalStory__block--top', 'portalStory__block--right')}>
                Text in portal
            </div>
        </Portal>
        <Portal id="bottomRightPortal">
            <div className={cn('portalStory__block', 'portalStory__block--bottom', 'portalStory__block--right')}>
                Text in portal
            </div>
        </Portal>
        <Portal id="bottomLightPortal">
            <div className={cn('portalStory__block', 'portalStory__block--bottom', 'portalStory__block--left')}>
                Text in portal
            </div>
        </Portal>
        <Portal id="topLeftPortal">
            <div className={cn('portalStory__block', 'portalStory__block--top', 'portalStory__block--left')}>
                Text in portal
            </div>
        </Portal>
    </div>
);

export const PortalStory: StoryObj<typeof Template> = {
    name: 'Portal story',
    render: Template
};

export default {
    title: 'components/Portal'
};
