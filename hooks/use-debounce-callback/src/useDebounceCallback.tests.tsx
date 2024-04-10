import React, { useState } from 'react';
import { render, screen, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useDebounceCallback from './useDebounceCallback';

const oldValue = 'old value';
const newValue = 'new value';
const timeout = 2000;
const debouncedChangeLabel = 'debounced change label';
const changeLabel = 'change label';
const resetLabel = 'reset label';

const Setup = (): JSX.Element => {
    const [value, setValue] = useState(oldValue);
    const setDebounceValue = useDebounceCallback(setValue, timeout);

    return (
        <div className="container">
            <span>
                Value: <span>{value}</span>
            </span>
            <button aria-label={debouncedChangeLabel} onClick={() => setDebounceValue(newValue)}>
                debounced change
            </button>
            <button aria-label={changeLabel} onClick={() => setValue(newValue)}>
                change
            </button>
            <button aria-label={resetLabel} onClick={() => setValue(oldValue)}>
                reset
            </button>
        </div>
    );
};

describe('hooks/useDebounceCallback', () => {
    test('useDebounceCallback works', async () => {
        render(<Setup />);

        const debouncedChangeButton = await screen.findByLabelText(debouncedChangeLabel);
        const changeButton = await screen.findByLabelText(changeLabel);
        const resetButton = await screen.findByLabelText(resetLabel);
        expect(screen.findByText(oldValue)).toBeInTheDocument();
        userEvent.click(changeButton);
        expect(screen.findByText(newValue)).toBeInTheDocument();
        userEvent.click(resetButton);
        expect(screen.findByText(oldValue)).toBeInTheDocument();
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
