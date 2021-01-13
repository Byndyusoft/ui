import React from 'react';
import { Meta } from '@storybook/react';
import CollapsibleGroup from './CollapsibleGroup';

export const DefaultStory = () => <CollapsibleGroup />;

DefaultStory.storyName = 'Default';

const meta: Meta = {
    title: 'CollapsibleGroup',
    component: CollapsibleGroup
};

export default meta;
