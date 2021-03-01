import React from 'react';
import { Meta, Story } from '@storybook/react';
import Button from './Button';
import { Variant } from './constants';
import './Button.css';

export const PrimaryStory: Story = () => (
    <>
        <div>
            Default:
            <Button variant={Variant.Primary}>Кнопка</Button>
        </div>
        <div>
            Disabled:
            <Button variant={Variant.Primary} isDisabled>
                Кнопка
            </Button>
        </div>
        <div>
            Pending:
            <Button variant={Variant.Primary} isPending>
                Кнопка
            </Button>
        </div>
    </>
);

PrimaryStory.storyName = 'Primary';

export const SecondaryStory: Story = () => (
    <>
        <div>
            Default:
            <Button variant={Variant.Secondary}>Кнопка</Button>
        </div>
        <div>
            Disabled:
            <Button variant={Variant.Secondary} isDisabled>
                Кнопка
            </Button>
        </div>
        <div>
            Pending:
            <Button variant={Variant.Secondary} isPending>
                Кнопка
            </Button>
        </div>
    </>
);

SecondaryStory.storyName = 'Secondary';

export const OutlineStory: Story = () => (
    <>
        <div>
            Default:
            <Button variant={Variant.Outline}>Кнопка</Button>
        </div>
        <div>
            Disabled:
            <Button variant={Variant.Outline} isDisabled>
                Кнопка
            </Button>
        </div>
        <div>
            Pending:
            <Button variant={Variant.Outline} isPending>
                Кнопка
            </Button>
        </div>
    </>
);

OutlineStory.storyName = 'Outline';

export const DangerStory: Story = () => (
    <>
        <div>
            Default:
            <Button variant={Variant.Danger}>Кнопка</Button>
        </div>
        <div>
            Disabled:
            <Button variant={Variant.Danger} isDisabled>
                Кнопка
            </Button>
        </div>
        <div>
            Pending:
            <Button variant={Variant.Danger} isPending>
                Кнопка
            </Button>
        </div>
    </>
);

DangerStory.storyName = 'Danger';

const meta: Meta = {
    title: 'Button',
    component: Button
};

export default meta;
