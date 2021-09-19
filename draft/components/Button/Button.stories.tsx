import React from 'react';
import { Meta, Story } from '@storybook/react';
import Button from './Button';
import { Variant } from './constants';
import './Button.css';

export const DefaultStory: Story = () => <Button>Button</Button>;

DefaultStory.storyName = 'Default';

export const PrimaryStory: Story = () => <Button variant={Variant.Primary}>Primary Button</Button>;

PrimaryStory.storyName = 'Primary';

export const DangerStory: Story = () => <Button variant={Variant.Danger}>Danger Button</Button>;

DangerStory.storyName = 'Danger';

const meta: Meta = {
    title: 'Button',
    component: Button
};

export default meta;
