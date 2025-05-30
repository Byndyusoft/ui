import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import InfiniteCanvas from './partials/InfiniteCanvas';
import { IInfiniteCanvasProps } from './InfiniteCanvas.types';
import MovableNode from './partials/MovableNode';

const meta: Meta<typeof InfiniteCanvas> = {
    title: 'components/InfiniteCanvas',
    component: InfiniteCanvas
};

export default meta;

const Template = (args: IInfiniteCanvasProps): JSX.Element => (
    <InfiniteCanvas {...args}>
        <MovableNode>123</MovableNode>
    </InfiniteCanvas>
);

export const Default: StoryObj<typeof Template> = {
    render: Template,
    args: {}
};
