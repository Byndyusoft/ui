import React from 'react';
import { StoryObj } from '@storybook/react';
import { IFlexProps } from './Flex.types';
import Flex from './Flex';

const Template = (args: IFlexProps): JSX.Element => <Flex {...args}>1231</Flex>;

export const FlexStory: StoryObj<typeof Template> = {
    name: 'Story name',
    render: Template,
    args: {}
};

export default {
    title: 'components/Flex'
};
