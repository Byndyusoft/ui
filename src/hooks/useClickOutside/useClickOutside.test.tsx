import React, { FC, useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import useClickOutside from '.';

describe('hooks/useClickOutside', () => {
    test('Click outside works', () => {
        render(<Component />);

        const counterInput = screen.getByTestId('counterInput') as HTMLInputElement;
        expect(counterInput.value).toBe('0');

        const clickMeBtn = screen.getByLabelText('clickMeBtn') as HTMLButtonElement;
        const mayNotClickMeBtn = screen.getByLabelText('mayNotClickMeBtn') as HTMLButtonElement;

        // Click inside
        act(() => {
            fireEvent.click(clickMeBtn);
        });

        expect(counterInput.value).toBe('0');

        // Click outside
        act(() => {
            fireEvent.click(mayNotClickMeBtn);
        });

        expect(counterInput.value).toBe('1');
    });

    test('Only last referred component counts', () => {
        render(<LastReferredComponentCase />);

        const counterInput = screen.getByTestId('counterInput') as HTMLInputElement;
        expect(counterInput.value).toBe('0');

        const clickMeBtn = screen.getByLabelText('clickMeBtn') as HTMLButtonElement;
        const mayNotClickMeBtn = screen.getByLabelText('mayNotClickMeBtn') as HTMLButtonElement;

        // Click inside
        act(() => {
            fireEvent.click(clickMeBtn);
        });

        expect(counterInput.value).toBe('0');

        // Click outside
        act(() => {
            fireEvent.click(mayNotClickMeBtn);
        });

        expect(counterInput.value).toBe('1');
    });
});

const Component: FC = () => {
    const [counterValue, setCounterValue] = useState<number>(0);

    const [ref] = useClickOutside(() => {
        setCounterValue(prevValue => prevValue + 1);
    });

    return (
        <div>
            <input
                data-testid="counterInput"
                type="text"
                value={counterValue}
                onChange={() => {
                    //do nothing
                }}
            />
            <div>{`Counter: ${counterValue}`}</div>
            <div>
                <button type="button" aria-label="clickMeBtn" ref={ref}>
                    Click me!
                </button>
                <button type="button" aria-label="mayNotClickMeBtn">
                    May not click me
                </button>
            </div>
        </div>
    );
};

const LastReferredComponentCase: FC = () => {
    const [counterValue, setCounterValue] = useState<number>(0);

    const [ref] = useClickOutside(() => {
        setCounterValue(prevValue => prevValue + 1);
    });

    return (
        <div>
            <input
                data-testid="counterInput"
                type="text"
                value={counterValue}
                onChange={() => {
                    //do nothing
                }}
            />
            <div>{`Counter: ${counterValue}`}</div>
            <div>
                <button type="button" aria-label="mayNotClickMeBtn" ref={ref}>
                    May not click me
                </button>
                <button type="button" aria-label="clickMeBtn" ref={ref}>
                    Click me!
                </button>
            </div>
        </div>
    );
};
