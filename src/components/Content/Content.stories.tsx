import React from 'react';
import { Meta } from '@storybook/react';
import Content from './Content';
import Skeleton from '../Skeleton';

export const ContentStory = () => (
    <Content>
        <Skeleton className="font-white">Content</Skeleton>
    </Content>
);

ContentStory.storyName = 'Default';

export const ContentAsSectionStory = () => (
    <Content as="section">
        <Skeleton className="font-white">Wrapper rendered as section</Skeleton>
    </Content>
);

ContentAsSectionStory.storyName = 'Use custom element';

const meta: Meta = {
    title: 'Content',
    component: Content
};

export default meta;
