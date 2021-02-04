import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import TabContent from './TabContent';
import Tabs from './Tabs';
import Tab from './Tab';

export const TabsStories: Story = () => (
    <Tabs>
        {['first tab', 'second tab', 'third tab'].map((tab, i) => (
            <div key={i} style={{ marginRight: '1rem', display: 'inline-flex' }}>
                <Tab index={i}>{tab}</Tab>
            </div>
        ))}
        <div style={{ margin: '1rem 0' }}>
            {['firts tab content', 'second tab content', 'third tab content'].map((tab, i) => (
                <TabContent key={i} index={i}>
                    {tab}
                </TabContent>
            ))}
        </div>
    </Tabs>
);

TabsStories.storyName = 'Tabs';

export const TabsInitialIndexStories: Story = () => {
    const [currentTabIndex, setCurrentTabIndex] = useState(1);

    return (
        <>
            <Tabs activeTabIndex={currentTabIndex}>
                {['first tab', 'second tab', 'third tab'].map((tab, i) => (
                    <div key={i} style={{ marginRight: '1rem', display: 'inline-flex' }}>
                        <Tab index={i}>{tab}</Tab>
                    </div>
                ))}
                <div style={{ margin: '1rem 0' }}>
                    {['firts tab content', 'second tab content', 'third tab content'].map((tab, i) => (
                        <TabContent key={i} index={i}>
                            {tab}
                        </TabContent>
                    ))}
                </div>
            </Tabs>

            <button
                type="button"
                onClick={() => {
                    setCurrentTabIndex(2);
                }}
            >
                сlick to set active tab to third
            </button>
        </>
    );
};

TabsInitialIndexStories.storyName = 'Control active tab from outside';

const meta: Meta = {
    title: 'Components/Tabs',
    component: Tabs
};

export default meta;
