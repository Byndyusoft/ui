import React from 'react';
import { Meta, Story } from '@storybook/react';
import Button from './Button';
import { Variant } from './constants';
import './Button.css';

export const PrimaryStory: Story = () => (
    <>
        <Button variant={Variant.Primary}>Кнопка</Button>
        <Button variant={Variant.Primary} isDisabled>
            Кнопка
        </Button>
    </>
);

PrimaryStory.storyName = 'Primary';

export const SecondaryStory: Story = () => (
    <>
        <Button variant={Variant.Secondary}>Кнопка</Button>
        <Button variant={Variant.Secondary} isDisabled>
            Кнопка
        </Button>
    </>
);

SecondaryStory.storyName = 'Secondary';

export const OutlineStory: Story = () => (
    <>
        <Button variant={Variant.Outline}>Кнопка</Button>
        <Button variant={Variant.Outline} isDisabled>
            Кнопка
        </Button>
    </>
);

OutlineStory.storyName = 'Outline';

export const DangerStory: Story = () => (
    <>
        <Button variant={Variant.Danger}>Кнопка</Button>
        <Button variant={Variant.Danger} isDisabled>
            Кнопка
        </Button>
    </>
);

DangerStory.storyName = 'Danger';

const meta: Meta = {
    title: 'Button',
    component: Button
};

export default meta;
