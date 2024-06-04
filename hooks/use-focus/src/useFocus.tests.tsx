import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import useFocus from './useFocus';

interface ISetupProps {
    autofocus?: boolean;
}

const Setup = ({ autofocus = false }: ISetupProps): JSX.Element => {
    const elementToFocus = useRef(null);
    const elementToBlur = useRef(null);

    const isFocused = useFocus(elementToFocus, autofocus);

    return (
        <div>
            <button type="button" ref={elementToBlur} aria-label="blur-button">
                Blur
            </button>
            <button type="button" ref={elementToFocus} aria-label="focus-button">
                {isFocused ? 'focused' : 'unfocused'}
            </button>
        </div>
    );
};

describe('hooks/useFocus', () => {
    test('focus works', async () => {
        render(<Setup />);

        const button = screen.getByLabelText('focus-button');
        await userEvent.click(button);

        expect(button).toHaveTextContent('focused');
    });

    test('blur works', async () => {
        render(<Setup />);

        const focusButton = screen.getByLabelText('focus-button');
        const blurButton = screen.getByLabelText('blur-button');

        await userEvent.click(focusButton);

        expect(focusButton).toHaveTextContent('focused');

        await userEvent.click(blurButton);

        expect(focusButton).toHaveTextContent('unfocused');
    });

    test('autofocus works', async () => {
        render(<Setup autofocus />);

        const focusButton = screen.getByLabelText('focus-button');
        const blurButton = screen.getByLabelText('blur-button');

        expect(focusButton).toHaveTextContent('focused');

        await userEvent.click(blurButton);

        expect(focusButton).toHaveTextContent('unfocused');

        await userEvent.click(focusButton);

        expect(focusButton).toHaveTextContent('focused');
    });
});
