import React, { useState } from 'react';
import { StoryObj } from '@storybook/react';
import Highlighter from './Highlighter';
import type { IHighlighterProps } from './Highlighter.types';

const Template = (args: IHighlighterProps): JSX.Element => <Highlighter {...args} />;

export const BaseStory: StoryObj<typeof Template> = {
    name: 'Base story',
    render: Template,
    args: {
        searchValues: ['re'],
        text: 'Warehouse',
        ignoreCase: true
    }
};

export const HighlightWithOverlappingSearchValuesStory: StoryObj<typeof Template> = {
    name: 'Highlight with overlapping search values',
    render: Template,
    args: {
        searchValues: ['This', 'is'],
        text: 'This is a test string'
    }
};

function customHighlight(str: string): JSX.Element {
    return <strong>{str}</strong>;
}

export const CustomHighlightStory: StoryObj<typeof Template> = {
    name: 'Custom highlight',
    render: Template,
    args: {
        searchValues: ['re'],
        text: 'Warehouse',
        ignoreCase: true,
        highlighter: customHighlight
    }
};

const text =
    'Trado cribro custodia tum amissio aut. \n Ascit ubi vetus depraedor decerno terminatio cicuta caput provident';

const InteractiveTemplate = (args: IHighlighterProps): JSX.Element => {
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

export const InteractiveWithIgnoreSpacesStory: StoryObj<typeof InteractiveTemplate> = {
    name: 'Interactive with ignore spaces',
    render: InteractiveTemplate,
    args: {
        searchValues: ['brocusto'],
        text,
        ignoreCase: true,
        ignoreSpaces: true
    }
};

export default {
    title: 'components/Highlighter',
    parameters: {
        layout: 'fullscreen'
    }
};
