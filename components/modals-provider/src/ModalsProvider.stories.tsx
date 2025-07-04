import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ModalsProvider, { useModals, useModalsState } from './';
import Flex from '@byndyusoft-ui/flex';
import styles from './ModalsProvider.stories.module.css';

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
        <Flex gap="su300">
            <Flex direction="column" gap="su100">
                <Flex as="label" direction="column" gap="su025">
                    Current modal ID
                    <input
                        type="number"
                        placeholder="Введи id модалки"
                        value={currentModalId}
                        onChange={({ target }) => setCurrentModalId(target.value)}
                    />
                </Flex>

                <Flex gap="su025">
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
