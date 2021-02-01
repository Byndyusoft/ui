import React from 'react';
import { Meta, Story } from '@storybook/react';
import Tabs from './Tabs';
import Tab from './Tab';
import TabContent from './TabContent';

export const TabsStories: Story = () => (
    <Tabs>
        {['firts', 'second', 'third'].map((tab, i) => (
            <Tab key={i}>{tab}</Tab>
        ))}
        {['firts', 'second', 'third'].map((tab, i) => (
            <TabContent key={i}>{tab}</TabContent>
        ))}
    </Tabs>
);

TabsStories.storyName = 'Tabs';

const meta: Meta = {
    title: 'Components/Tabs',
    component: Tabs
};

export default meta;
