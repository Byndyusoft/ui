import React from 'react';
import { Meta } from '@storybook/react';
import Button, { Variant } from '../src/components/Button';
import '../src/components/Button/Button.css';

export const ButtonStory = () => <Button>Button</Button>;

export const ButtonPrimary = () => <Button variant={Variant.Primary}>Primary Button</Button>;

export const ButtonDanger = () => <Button variant={Variant.Danger}>Danger Button</Button>;

ButtonStory.storyName = 'Default';
ButtonPrimary.storyName = 'Primary';
ButtonDanger.storyName = 'Danger';

const meta: Meta = {
    title: 'Button',
    component: Button
};

export default meta;
