import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useDebouncedValue from './useDebouncedValue';

const debouncedValueLabel = 'debounced value';
const inputValue = '1111';

const Setup = (): JSX.Element => {
    const [debouncedValue, setDebouncedValue] = useDebouncedValue('', 2000);

    return (
        <div className="container">
            <span>
                Debounced value: <span aria-label={debouncedValueLabel}>{debouncedValue}</span>
            </span>
            <input onChange={e => setDebouncedValue(e.target.value)} />
        </div>
    );
};

describe('hooks/useDebouncedValue', () => {
    test('useDebouncedValue works', async () => {
        render(<Setup />);

        const input = await screen.findByRole('textbox');
        userEvent.type(input, inputValue);

        await waitFor(
            () => {
                expect(screen.getByLabelText(debouncedValueLabel)).toHaveTextContent(inputValue);
            },
            { timeout: 2100 }
        );
    });
});
