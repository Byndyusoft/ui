import React from 'react';
import { Meta } from '@storybook/react';
import '../src/Skeleton/Skeleton.css';
import Skeleton from '../src/Skeleton';
import Spacer from '../src/Spacer';

export const SpacerStory = () => (
    <>
        <Skeleton className="font-white">y=&#123;1&#125;</Skeleton>
        <Spacer y={1} />
        <Skeleton className="font-white">y=&#123;2&#125;</Skeleton>
        <Spacer y={2} />
        <Skeleton className="font-white">y=&#123;4&#125;</Skeleton>
        <Spacer y={4} />
        <Skeleton className="font-white">&nbsp;</Skeleton>
    </>
);

SpacerStory.storyName = 'Vertical';

export const SpacerHorizontalStory = () => (
    <div style={{ display: 'flex' }}>
        <Skeleton className="font-white">x=&#123;1&#125;</Skeleton>
        <Spacer x={1} />
        <Skeleton className="font-white">x=&#123;2&#125;</Skeleton>
        <Spacer x={2} />
        <Skeleton className="font-white">x=&#123;4&#125;</Skeleton>
        <Spacer x={4} />
        <Skeleton className="font-white">x=&#123;4&#125;</Skeleton>
    </div>
);

SpacerHorizontalStory.storyName = 'Horizontal';

const meta: Meta = {
    title: 'Layout/Spacer',
    component: Spacer
};

export default meta;
