import React from 'react';
import cn from 'classnames';
import { Story } from '@storybook/react';
import Portal from './Portal';
import './Portal.stories.scss';

const Template: Story = () => (
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

export const Example = Template.bind({});
