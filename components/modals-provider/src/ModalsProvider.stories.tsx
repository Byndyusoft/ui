import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { createFlex } from '@byndyusoft-ui/flex';
import { createView } from '@byndyusoft-ui/view';
import { ModalsProvider, useModals, useModalsState } from './ModalsContext';
import styles from './ModalsProvider.stories.module.css';

const View = createView({
    unit: '1rem',
    grid: { '025': 0.25, '100': 1, '300': 3 }
} as const);

const Flex = createFlex(View);

const meta: Meta<typeof ModalsProvider> = {
    title: 'components/ModalsProvider',
    component: ModalsProvider
};

export default meta;

const ModalsProviderContent = () => {
    const [currentModalId, setCurrentModalId] = useState<string>('');

    const modalsActions = useModals();
    const modalsState = useModalsState();

    return (
        <Flex gap="300">
            <Flex direction="column" gap="100">
                <Flex as="label" direction="column" gap="025">
                    Current modal ID
                    <input
                        type="number"
                        placeholder="Введи id модалки"
                        value={currentModalId}
                        onChange={({ target }) => setCurrentModalId(target.value)}
                    />
                </Flex>

                <Flex gap="025">
                    <button onClick={() => modalsActions.register(currentModalId)}>Register</button>

                    <button onClick={() => modalsActions.open(currentModalId)}>Open</button>

                    <button onClick={() => modalsActions.close(currentModalId)}>Close</button>

                    <button onClick={() => modalsActions.unregister(currentModalId)}>Unregister</button>
                </Flex>
            </Flex>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Modal ID</th>
                        <th>Modal status</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(modalsState).map(([id, status]) => (
                        <tr key={id}>
                            <td>{id}</td>
                            <td>{status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Flex>
    );
};

const Template = (): JSX.Element => (
    <ModalsProvider>
        <ModalsProviderContent />
    </ModalsProvider>
);

export const Default: StoryObj<typeof Template> = {
    render: Template,
    args: {}
};
