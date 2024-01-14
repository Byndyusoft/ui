import React, { useCallback, useMemo, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useEventListener from './useEventListener';

interface ISetupProps {
    isDocumentListener?: boolean;
}

const handler = jest.fn();

afterEach(() => {
    jest.clearAllMocks();
});

const Setup = ({ isDocumentListener }: ISetupProps): JSX.Element => {
    const elementRef = useRef(null);
    const documentRef = useRef(document);

    const actualRef = useMemo(() => {
        if (isDocumentListener) {
            return documentRef;
        }

        return elementRef;
    }, [isDocumentListener]);

    useEventListener('click', handler, actualRef);

    return (
        <button type="button" ref={elementRef}>
            Click on me!
        </button>
    );
};

const SetupForWindow = (): JSX.Element => {
    useEventListener('click', handler);

    return <button type="button">Click on me!</button>;
};

const getButtonElement = () => screen.getByRole('button', { name: 'Click on me!' });

describe('hooks/useEventListener', () => {
    test('adds event listener to element ref', async () => {
        render(<Setup />);

        await userEvent.click(getButtonElement());

        expect(handler).toBeCalledTimes(1);
    });

    test('adds event listener to document ref', async () => {
        render(<Setup isDocumentListener />);

        await userEvent.click(getButtonElement());

        expect(handler).toBeCalledTimes(1);
    });

    test('adds event listener to window', async () => {
        render(<SetupForWindow />);

        await userEvent.click(getButtonElement());

        expect(handler).toBeCalledTimes(1);
    });
});
