import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useDebouncedCallback from './useDebouncedCallback';

const oldValue = 'old value';
const newValue = 'new value';
const timeout = 2000;
const debouncedChangeLabel = 'debounced change label';

const Setup = (): JSX.Element => {
    let value = oldValue;
    const handleChangeValue = () => (value = newValue);
    const setDebounceValue = useDebouncedCallback(handleChangeValue, timeout);

    return (
        <div className="container">
            <span>
                Value: <span>{value}</span>
            </span>
            <button aria-label={debouncedChangeLabel} onClick={setDebounceValue}>
                debounced change
            </button>
        </div>
    );
};

describe('hooks/useDebouncedCallback', () => {
    test('useDebouncedCallback works', async () => {
        render(<Setup />);
        expect(screen.findByText(oldValue)).toBeInTheDocument();
        const debouncedChangeButton = await screen.getByLabelText(debouncedChangeLabel);
        userEvent.click(debouncedChangeButton);
        expect(screen.findByText(oldValue)).toBeInTheDocument();
        await waitFor(
            () => {
                expect(screen.findByText(newValue)).toBeInTheDocument();
            },
            { timeout: 2500 }
        );
    });
});
