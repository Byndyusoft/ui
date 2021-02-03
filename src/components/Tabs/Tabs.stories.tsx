import React from 'react';
import { Meta, Story } from '@storybook/react';
import TabContent from './TabContent';
import Tabs from './Tabs';
import Tab from './Tab';

export const TabsStories: Story = () => (
    <Tabs>
        {['first', 'second', 'third'].map((tab, i) => (
            <Tab key={i} index={i}>
                {tab}
            </Tab>
        ))}
        {['firts content', 'second content', 'third content'].map((tab, i) => (
            <TabContent key={i} index={i}>
                {tab}
            </TabContent>
        ))}
    </Tabs>
);

TabsStories.storyName = 'Tabs';

const meta: Meta = {
    title: 'Components/Tabs',
    component: Tabs
};

export default meta;
