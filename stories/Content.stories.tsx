import React from 'react';
import { Meta } from '@storybook/react';
import '../src/Content/Content.css';
import Content from '../src/Content';
import Skeleton from '../src/Skeleton';
import Spacer from '../src/Spacer';

export const ContentStory = () => (
    <Content auto>
        <Skeleton className="font-white">Default Content is Medium size</Skeleton>
    </Content>
);

ContentStory.storyName = 'Default';

export const ContentAsSectionStory = () => (
    <Content as="section">
        <Skeleton className="font-white">Wrapper rendered as section</Skeleton>
    </Content>
);

ContentAsSectionStory.storyName = 'Use custom element';

export const ContentMaxWidthStory = () => (
    <>
        <Content maxWidth="ExtraSmall">
            <Skeleton className="font-white">Max width ExtraSmall</Skeleton>
        </Content>
        <Spacer y={1} />
        <Content maxWidth="Small">
            <Skeleton className="font-white">Max width Small</Skeleton>
        </Content>
        <Spacer y={1} />
        <Content maxWidth="Medium">
            <Skeleton className="font-white">Max width Medium</Skeleton>
        </Content>
        <Spacer y={1} />
        <Content maxWidth="Large">
            <Skeleton className="font-white">Max width Large</Skeleton>
        </Content>{' '}
        <Spacer y={1} />
        <Content maxWidth="ExtraLarge">
            <Skeleton className="font-white">Max width ExtraLarge</Skeleton>
        </Content>
    </>
);

ContentMaxWidthStory.storyName = 'Content max-width';

export const ContentCenterStory = () => (
    <>
        <Content maxWidth="ExtraSmall" auto>
            <Skeleton className="font-white">ExtraSmall auto</Skeleton>
        </Content>
        <Spacer y={1} />
        <Content maxWidth="Small" auto>
            <Skeleton className="font-white">Small auto</Skeleton>
        </Content>
        <Spacer y={1} />
        <Content maxWidth="Medium" auto>
            <Skeleton className="font-white">Medium auto</Skeleton>
        </Content>
        <Spacer y={1} />
        <Content maxWidth="Large" auto>
            <Skeleton className="font-white">Large auto</Skeleton>
        </Content>
        <Spacer y={1} />
        <Content maxWidth="ExtraLarge" auto>
            <Skeleton className="font-white">ExtraLarge auto</Skeleton>
        </Content>
    </>
);

ContentCenterStory.storyName = 'Center content';

const meta: Meta = {
    title: 'Layout/Content',
    component: Content
};

export default meta;
