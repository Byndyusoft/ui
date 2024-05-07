import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalsProvider, { useModals } from '@byndyusoft-ui/ModalsProvider';
import Modal from './Modal';

interface ISceneProps {
    onOpen?: () => void;
    onClose?: () => void;
}

const Scene = ({ onOpen, onClose }: ISceneProps): JSX.Element => {
    const { open } = useModals();

    return (
        <>
            <button onClick={() => open('modal')}>Open</button>
            <Modal id="modal" onOpen={onOpen} onClose={onClose}>
                Test
            </Modal>
        </>
    );
};

describe('components/Modal', () => {
    test('renders correctly', async () => {
        render(
            <ModalsProvider>
                <Scene />
            </ModalsProvider>
        );

        expect(screen.getByRole('document')).not.toHaveClass('is-open');

        await userEvent.click(screen.getByText(/Open/));

        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.getByRole('document')).toHaveClass('is-open');
    });

    test('calls `onOpen` callback', async () => {
        const onOpen = jest.fn();

        render(
            <ModalsProvider>
                <Scene onOpen={onOpen} />
            </ModalsProvider>
        );

        await userEvent.click(screen.getByText(/Open/));

        expect(onOpen).toBeCalledTimes(1);
    });

    test('calls `onClose` callback by button click', async () => {
        const onClose = jest.fn();

        render(
            <ModalsProvider>
                <Scene onClose={onClose} />
            </ModalsProvider>
        );

        await userEvent.click(screen.getByText(/Open/));

        expect(screen.getByRole('document')).toHaveClass('is-open');

        await userEvent.click(screen.getByRole('button', { name: /Close/ }));

        expect(onClose).toBeCalledTimes(1);
    });

    test('calls `onClose` callback by overlay click', async () => {
        const onClose = jest.fn();

        render(
            <ModalsProvider>
                <Scene onClose={onClose} />
            </ModalsProvider>
        );

        await userEvent.click(screen.getByText(/Open/));

        expect(screen.getByRole('document')).toHaveClass('is-open');

        await userEvent.click(screen.getAllByRole('button')[1]);

        expect(onClose).toBeCalledTimes(1);
    });
});
