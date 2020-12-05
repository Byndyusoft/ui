import React from 'react';
import { Meta } from '@storybook/react';
import Content from '../src/Content';
import Skeleton from '../src/Skeleton';
import Stack from '../src/Stack';

export const ContentStory = () =>
    <Content>
        <Skeleton className="font-white">
                Content
        </Skeleton>
    </Content>;

ContentStory.storyName = 'Default';

export const ContentAsSectionStory = () =>
    <Content as='section'>
        <Skeleton className="font-white">
            Wrapper rendered as section
        </Skeleton>
    </Content>;

ContentAsSectionStory.storyName  = 'Use custom element';

const meta: Meta = {
  title: 'Layout/Content',
  component: Content,
};

export default meta;