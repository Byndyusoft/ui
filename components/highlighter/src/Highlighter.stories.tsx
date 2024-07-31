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
    highlight: 're',
    text: 'Warehouse',
    ignoreCase: true
};

function customHighlight(str: string): JSX.Element {
    return <strong>{str}</strong>;
}

export const CustomHighlight = Template.bind({});
CustomHighlight.args = {
    highlight: 're',
    text: 'Warehouse',
    ignoreCase: true,
    customHighlight
};

const text =
  'Trado cribro custodia tum amissio aut. \n Ascit ubi vetus depraedor decerno terminatio cicuta caput provident';

const InteractiveTemplate: Story<IHighlighterProps> = args => {
    const [highlight, setHighlight] = useState(args.highlight);

    return (
      <>
          <input type="text" value={highlight} onChange={e => setHighlight(e.target.value)} />
          <p>
              <Highlighter {...args} highlight={highlight} />
          </p>
      </>
    );
};

export const InteractiveWithIgnoreSpaces = InteractiveTemplate.bind({});
InteractiveWithIgnoreSpaces.args = {
    highlight: 'brocusto',
    text: text,
    ignoreCase: true,
    ignoreSpaces: true
};
