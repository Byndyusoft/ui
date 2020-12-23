import {Meta} from '@storybook/react';
import Stack from '../src/Stack';
import Skeleton from '../src/Skeleton';
import '../src/Skeleton/Skeleton.css';

export const StackStory = () => <>
  <Stack className='font-white'><Skeleton>Заготовка под stack</Skeleton></Stack>
  <Stack className='font-white'><Skeleton>Заготовка под stack</Skeleton></Stack>
</>;

StackStory.storyName  = 'Stack';

const meta: Meta = {
  title: 'Layout/Stack',
  component: Stack,
};

export default meta;
