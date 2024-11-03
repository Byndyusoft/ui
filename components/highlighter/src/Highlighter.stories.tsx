import React, { useState } from 'react';
import { Story } from '@storybook/react';

import Highlighter from './Highlighter';
import type { IHighlighterProps } from './Highlighter.types';

export default {
    title: 'packages/Highlighter',
    component: Highlighter,
    parameters: {
        layout: 'fullscreen'
    }
};

const Template: Story<IHighlighterProps> = args => <Highlighter {...args} />;

export const Default = Template.bind({});

Default.args = {
    searchValues: ['re'],
    text: 'Warehouse',
    ignoreCase: true
};

export const HighlightWithOverlappingSearchValues = Template.bind({});

HighlightWithOverlappingSearchValues.args = {
    searchValues: ['This', 'is'],
    text: 'This is a test string'
};

function customHighlight(str: string): JSX.Element {
    return <strong>{str}</strong>;
}

export const CustomHighlight = Template.bind({});

CustomHighlight.args = {
    searchValues: ['re'],
    text: 'Warehouse',
    ignoreCase: true,
    highlighter: customHighlight
};

const text =
    'Trado cribro custodia tum amissio aut. \n Ascit ubi vetus depraedor decerno terminatio cicuta caput provident';

const InteractiveTemplate: Story<IHighlighterProps> = args => {
    const [highlight, setHighlight] = useState(args.searchValues[0]);

    return (
        <>
            <input type="text" value={highlight} onChange={e => setHighlight(e.target.value)} />
            <p>
                <Highlighter {...args} searchValues={[highlight]} />
            </p>
        </>
    );
};

export const InteractiveWithIgnoreSpaces = InteractiveTemplate.bind({});

InteractiveWithIgnoreSpaces.args = {
    searchValues: ['brocusto'],
    text,
    ignoreCase: true,
    ignoreSpaces: true
};
