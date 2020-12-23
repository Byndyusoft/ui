import {Meta} from '@storybook/react';
import Skeleton from '../src/Skeleton';
import '../src/Skeleton/Skeleton.css';

export const SkeletonStory = () => <Skeleton className='font-white'>Skeleton</Skeleton>;

SkeletonStory.storyName  = 'Skeleton';

const meta: Meta = {
  title: 'Layout/Skeleton',
  component: Skeleton,
};

export default meta;
