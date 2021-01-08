import React from 'react';
import { Meta, Story } from '@storybook/react';
// import { Meta } from '@storybook/react/types';
import Flex from '../src/components/Flex';
import { IFlexProps } from '../src/components/Flex/Flex';
import '../src/components/Flex/Flex.css';
import Skeleton from '../src/components/Skeleton';

const Template: Story<IFlexProps> = args => (
    <div style={{ width: '300px', border: '1px solid black' }}>
        <Flex {...args}>
            <Skeleton>1</Skeleton>
            <Skeleton>2</Skeleton>
            <Skeleton>3</Skeleton>
        </Flex>
    </div>
);

export const FlexStory = Template.bind({});

FlexStory.storyName = 'Flex';

FlexStory.args = {
    wrap: 'wrap',
    direction: 'row'
};

const meta: Meta = {
    title: 'Layout',
    component: Flex,
    argTypes: {
        wrap: { control: { type: 'select', options: [true, 'wrap', 'no-wrap', 'wrap-reverse'] } },
        direction: { control: { type: 'select' } }
    }
};

export default meta;
