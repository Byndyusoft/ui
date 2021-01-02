import React from 'react';
import { Meta } from '@storybook/react';
import Stack from './Stack';
import Skeleton from '../Skeleton';
import '../Skeleton/Skeleton.css';

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
    title: 'Stack',
    component: Stack
};

export default meta;
