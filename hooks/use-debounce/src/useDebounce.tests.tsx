import React, { useState } from 'react';
import { render, screen, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useDebounce from './useDebounce';

const isReadyText = 'true';
const isNotReadyText = 'false';
const isReadyLabel = 'is ready';
const debouncedValueLabel = 'debounced value';
const inputValue = '1111';

const Setup = (): JSX.Element => {
    const [value, setValue] = useState('');
    const [debouncedValue, isReady] = useDebounce(value, 2000);

    return (
        <div className="container">
            <span>
                Debounced value: <span aria-label={debouncedValueLabel}>{debouncedValue}</span>
            </span>
            <span>
                Debounced value is ready:{' '}
                <span aria-label={isReadyLabel}>{isReady ? isReadyText : isNotReadyText}</span>
            </span>
            <input value={value} onChange={e => setValue(e.target.value)} />
        </div>
    );
};

describe('hooks/useDebounce', () => {
    test('useDebounce works', async () => {
        render(<Setup />);
        const isReady = await screen.findByLabelText(isReadyLabel);
        expect(isReady).toHaveTextContent(isReadyText);
        const input = await screen.findByRole('textbox');
        userEvent.type(input, inputValue);
        await waitFor(
            () => {
                expect(isReady).toHaveTextContent(isNotReadyText);
            },
            { timeout: 1000 }
        );
        await waitFor(
            () => {
                expect(screen.getByLabelText(debouncedValueLabel)).toHaveTextContent(inputValue);
                expect(isReady).toHaveTextContent(isReadyText);
            },
            { timeout: 2100 }
        );
    });
});
