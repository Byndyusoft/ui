import React from 'react';
import { Meta, Story } from '@storybook/react';
import TemplateName from './TemplateName';

export const DefaultStory: Story = () => <TemplateName />;

DefaultStory.storyName = 'Default';

const meta: Meta = {
    title: 'Components/TemplateName',
    component: TemplateName
};
export default meta;
