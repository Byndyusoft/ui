import React, { useState } from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import Toggle from './Toggle';

const TestComponent = ({ isDisabled }: { isDisabled?: boolean }): JSX.Element => {
    const [isToggled, setToogled] = useState<boolean>(false);

    return <Toggle toggled={isToggled} onToggle={setToogled} isDisabled={isDisabled} />;
};

describe('Toggle', () => {
    test('switching between values', () => {
        const dom = render(<TestComponent />);

        const toggleButton = dom.container.querySelector('[class=Toggle--container]') as HTMLElement;
        const sphereUntoggled = dom.container.querySelector('[class=Toggle--sphere-untoggled]') as HTMLElement;

        expect(toggleButton).toBeDefined();
        expect(sphereUntoggled).toBeDefined();

        // Switching to toggled state

        act(() => {
            fireEvent.click(toggleButton);
        });

        expect(sphereUntoggled).toBeNull();

        act(() => {
            fireEvent.click(toggleButton);
        });

        // Switching back to untoggled state

        expect(sphereUntoggled).toBeDefined();
    });

    test('disabled toggle is not switchable', () => {
        const dom = render(<TestComponent isDisabled />);

        const toggleButton = dom.container.querySelector(
            '[class="Toggle--container Toggle--container-isDisabled"]'
        ) as HTMLElement;
        const sphereUntoggled = dom.container.querySelector('[class=Toggle--sphere-untoggled]') as HTMLElement;

        expect(toggleButton).toBeDefined();
        expect(sphereUntoggled).toBeDefined();

        // Trying to switch disabled toggle

        act(() => {
            fireEvent.click(toggleButton);
        });

        // Still the same value

        expect(sphereUntoggled).toBeDefined();
    });
});
