import React from 'react';
import { Meta, Story } from '@storybook/react';
// import { Meta } from '@storybook/react/types';
import Flex from './index';
import { IFlexProps } from './Flex';
import Skeleton from '../Skeleton';

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
    direction: 'row',
    justify: 'start',
    alignItems: 'start',
    alignContent: 'start',
};

const meta: Meta = {
    title: 'Layout/Flex',
    component: Flex,
    argTypes: {
        wrap: { control: { type: 'select', options: [true, 'wrap', 'no-wrap', 'wrap-reverse'] } },
        direction: { control: { type: 'select' } },
        justify: {
            control: {
                type: 'select',
                options: ['start', 'center', 'end', 'between', 'around', 'evenly']
            }
        }
    }
};

export default meta;
