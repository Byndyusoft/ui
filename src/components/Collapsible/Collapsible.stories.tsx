import React from 'react';
import { Meta } from '@storybook/react';
import Collapsible from './Collapsible';

export const DefaultStory = () => <Collapsible />;

DefaultStory.storyName = 'Default';

const meta: Meta = {
    title: 'Collapsible',
    component: Collapsible
};

export default meta;
