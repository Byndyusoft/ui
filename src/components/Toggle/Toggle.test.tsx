import React, { useState } from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import Toggle from './Toggle';

const TestComponent = ({ isDisabled }: { isDisabled?: boolean }): JSX.Element => {
    const [isToggled, setToogled] = useState<boolean>(false);

    return <Toggle toggled={isToggled} onToggle={setToogled} isDisabled={isDisabled} />;
};

describe('Toggle', () => {
    test('switching between values', () => {
        render(<TestComponent />);

        const toggleButton = screen.getByRole('button');
        const toggleValue = screen.getByRole('switch') as HTMLInputElement;

        expect(toggleButton).toBeInTheDocument();
        expect(toggleValue.checked).toBeFalsy();

        // Switching to toggled state

        act(() => {
            fireEvent.click(toggleButton);
        });

        expect(toggleValue.checked).toBeTruthy();

        act(() => {
            fireEvent.click(toggleButton);
        });

        // Switching back to untoggled state

        expect(toggleValue.checked).toBeFalsy();
    });

    test('disabled toggle is not switchable', () => {
        render(<TestComponent isDisabled />);

        const toggleButton = screen.getByRole('button');
        const toggleValue = screen.getByRole('switch') as HTMLInputElement;

        expect(toggleButton).toBeInTheDocument();
        expect(toggleValue.checked).toBeFalsy();

        // Trying to switch to toggled state

        act(() => {
            fireEvent.click(toggleButton);
        });

        // Still the same value

        expect(toggleValue.checked).toBeFalsy();
    });
});
