import React from 'react';
import { Meta, Story } from '@storybook/react';
import cn from 'classnames';
import Portal from './Portal';
import './Portal.stories.css';

export const PortalStory: Story = () => {
    return (
        <div className="PortalStory">
            <p>Тест в основном контейнере приложения</p>
            <Portal id="topRightPortal">
                <div className={cn('PortalStory__Block', 'PortalStory__Block--Top', 'PortalStory__Block--Right')}>
                    Текст в портале
                </div>
            </Portal>
            <Portal id="bottomRightPortal">
                <div className={cn('PortalStory__Block', 'PortalStory__Block--Bottom', 'PortalStory__Block--Right')}>
                    Текст в портале
                </div>
            </Portal>
            <Portal id="bottomLightPortal">
                <div className={cn('PortalStory__Block', 'PortalStory__Block--Bottom', 'PortalStory__Block--Left')}>
                    Текст в портале
                </div>
            </Portal>
            <Portal id="topLeftPortal">
                <div className={cn('PortalStory__Block', 'PortalStory__Block--Top', 'PortalStory__Block--Left')}>
                    Текст в портале
                </div>
            </Portal>
        </div>
    );
};

PortalStory.storyName = 'Portal';

const meta: Meta = {
    title: 'components/Portal',
    component: Portal
};

export default meta;
