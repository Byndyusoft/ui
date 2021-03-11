import React from 'react';
import { Meta, Story } from '@storybook/react';
import Button from './Button';
import { Variant, Size } from './constants';

export const PrimaryStory: Story = () => (
    <table>
        <thead>
            <th aria-label="status cell" />
            <th>Small</th>
            <th>Medium</th>
            <th>Large</th>
        </thead>
        <tbody>
            <tr>
                <td>Default</td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Small}>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Medium}>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Large}>
                        Кнопка
                    </Button>
                </td>
            </tr>
            <tr>
                <td>Pending</td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Small} isPending>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Medium} isPending>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Large} isPending>
                        Кнопка
                    </Button>
                </td>
            </tr>
            <tr>
                <td>Disabled</td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Small} isDisabled>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Medium} isDisabled>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Primary} size={Size.Large} isDisabled>
                        Кнопка
                    </Button>
                </td>
            </tr>
        </tbody>
    </table>
);

PrimaryStory.storyName = 'Primary';

export const SecondaryStory: Story = () => (
    <table>
        <thead>
            <th aria-label="status cell" />
            <th>Small</th>
            <th>Medium</th>
            <th>Large</th>
        </thead>
        <tbody>
            <tr>
                <td>Default</td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Small}>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Medium}>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Large}>
                        Кнопка
                    </Button>
                </td>
            </tr>
            <tr>
                <td>Pending</td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Small} isPending>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Medium} isPending>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Large} isPending>
                        Кнопка
                    </Button>
                </td>
            </tr>
            <tr>
                <td>Disabled</td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Small} isDisabled>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Medium} isDisabled>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Secondary} size={Size.Large} isDisabled>
                        Кнопка
                    </Button>
                </td>
            </tr>
        </tbody>
    </table>
);

SecondaryStory.storyName = 'Secondary';

export const OutlineStory: Story = () => (
    <table>
        <thead>
            <th aria-label="status cell" />
            <th>Small</th>
            <th>Medium</th>
            <th>Large</th>
        </thead>
        <tbody>
            <tr>
                <td>Default</td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Small}>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Medium}>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Large}>
                        Кнопка
                    </Button>
                </td>
            </tr>
            <tr>
                <td>Pending</td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Small} isPending>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Medium} isPending>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Large} isPending>
                        Кнопка
                    </Button>
                </td>
            </tr>
            <tr>
                <td>Disabled</td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Small} isDisabled>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Medium} isDisabled>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Outline} size={Size.Large} isDisabled>
                        Кнопка
                    </Button>
                </td>
            </tr>
        </tbody>
    </table>
);

OutlineStory.storyName = 'Outline';

export const DangerStory: Story = () => (
    <table>
        <thead>
            <th aria-label="status cell" />
            <th>Small</th>
            <th>Medium</th>
            <th>Large</th>
        </thead>
        <tbody>
            <tr>
                <td>Default</td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Small}>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Medium}>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Large}>
                        Кнопка
                    </Button>
                </td>
            </tr>
            <tr>
                <td>Pending</td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Small} isPending>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Medium} isPending>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Large} isPending>
                        Кнопка
                    </Button>
                </td>
            </tr>
            <tr>
                <td>Disabled</td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Small} isDisabled>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Medium} isDisabled>
                        Кнопка
                    </Button>
                </td>
                <td>
                    <Button variant={Variant.Danger} size={Size.Large} isDisabled>
                        Кнопка
                    </Button>
                </td>
            </tr>
        </tbody>
    </table>
);

DangerStory.storyName = 'Danger';

const meta: Meta = {
    title: 'Button',
    component: Button
};

export default meta;
