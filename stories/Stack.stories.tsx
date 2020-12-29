import React from 'react';
import { Meta } from '@storybook/react';
import Stack from '../src/components/Stack';
import Skeleton from '../src/components/Skeleton';
import '../src/components/Skeleton/Skeleton.css';

export const StackStory = () => (
    <>
        <Stack className="font-white">
            <Skeleton>Заготовка под stack</Skeleton>
        </Stack>
        <Stack className="font-white">
            <Skeleton>Заготовка под stack</Skeleton>
        </Stack>
    </>
);

StackStory.storyName = 'Stack';

const meta: Meta = {
    title: 'Layout/Stack',
    component: Stack
};

export default meta;
