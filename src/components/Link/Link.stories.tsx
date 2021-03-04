import React from 'react';
import { Meta, Story } from '@storybook/react';
import Link from './Link';

export const LinkStory: Story = () => (
    <table>
        <thead>
            <th>Default</th>
            <th>Disabled</th>
        </thead>
        <tbody>
            <tr>
                <td>
                    <Link href="http://google.com">Ссылка</Link>
                </td>
                <td>
                    <Link href="http://google.com" isDisabled={true}>
                        Ссылка
                    </Link>
                </td>
            </tr>
        </tbody>
    </table>
);

LinkStory.storyName = 'Link';

const meta: Meta = {
    title: 'components/Link',
    component: Link
};

export default meta;
