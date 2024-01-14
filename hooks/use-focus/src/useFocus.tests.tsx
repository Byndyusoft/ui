import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFocus } from './useFocus';

interface ISetupProps {
    autofocus?: boolean;
}

const Setup = ({ autofocus = false }: ISetupProps): JSX.Element => {
    const elementToFocus = useRef(null);
    const elementToUnfocus = useRef(null);

    const isFocused = useFocus(elementToFocus, autofocus);

    return (
        <div>
            <button type="button" ref={elementToUnfocus} aria-label="unfocus-button">
                Unfocus
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

        expect(button.textContent).toBe('focused');
    });

    test('unfocus works', async () => {
        render(<Setup />);

        const focusButton = screen.getByLabelText('focus-button');
        const unfocusButton = screen.getByLabelText('unfocus-button');

        await userEvent.click(focusButton);

        expect(focusButton.textContent).toBe('focused');

        await userEvent.click(unfocusButton);

        expect(focusButton.textContent).toBe('unfocused');
    });

    test('autofocus works', async () => {
        render(<Setup autofocus />);

        const focusButton = screen.getByLabelText('focus-button');
        const unfocusButton = screen.getByLabelText('unfocus-button');

        expect(focusButton.textContent).toBe('focused');

        await userEvent.click(unfocusButton);

        expect(focusButton.textContent).toBe('unfocused');

        await userEvent.click(focusButton);

        expect(focusButton.textContent).toBe('focused');
    });
});
