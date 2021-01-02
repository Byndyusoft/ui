import React from 'react';
import { Meta } from '@storybook/react';
import Button from './Button';
import { Variant } from './constants';
import '../src/Button/Button.css';

export const DefaultStory = () => <Button>Button</Button>;

DefaultStory.storyName = 'Default';

export const PrimaryStory = () => <Button variant={Variant.Primary}>Primary Button</Button>;

PrimaryStory.storyName = 'Primary';

export const DangerStory = () => <Button variant={Variant.Danger}>Danger Button</Button>;

DangerStory.storyName = 'Danger';

const meta: Meta = {
    title: 'Button',
    component: Button
};

export default meta;
