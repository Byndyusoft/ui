import React from 'react';
import { Meta } from '@storybook/react';
import Skeleton from './Skeleton';
import './Skeleton.css';

export const SkeletonStory = () => <Skeleton className="font-white">Skeleton</Skeleton>;

SkeletonStory.storyName = 'Skeleton';

const meta: Meta = {
    title: 'Skeleton',
    component: Skeleton
};

export default meta;
