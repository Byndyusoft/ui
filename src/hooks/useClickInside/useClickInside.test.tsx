import React, { FC, useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import useClickInside from './useClickInside';

describe('hooks/useClickInside', () => {
    test('Click inside works', () => {
        render(<Component />);

        const counterInput = screen.getByTestId('counterInput') as HTMLInputElement;
        expect(counterInput.value).toBe('0');

        const clickMeBtn = screen.getByLabelText('clickMeBtn') as HTMLSpanElement;

        act(() => {
            fireEvent.click(clickMeBtn);
        });

        expect(counterInput.value).toBe('1');
    });

    test('Clicking non referred elements ignored', () => {
        render(<Component />);

        const counterInput = screen.getByTestId('counterInput') as HTMLInputElement;
        expect(counterInput.value).toBe('0');

        const mayNotClickMeBtn = screen.getByLabelText('mayNotClickMeBtn') as HTMLSpanElement;

        act(() => {
            fireEvent.click(mayNotClickMeBtn);
        });

        expect(counterInput.value).toBe('0');
    });

    test('Only last referred component counts', () => {
        render(<LastReferredComponentCase />);

        const counterInput = screen.getByTestId('counterInput') as HTMLInputElement;
        expect(counterInput.value).toBe('0');

        const clickMeBtn = screen.getByLabelText('clickMeBtn') as HTMLSpanElement;
        const mayNotClickMeBtn = screen.getByLabelText('mayNotClickMeBtn') as HTMLSpanElement;

        act(() => {
            fireEvent.click(mayNotClickMeBtn);
        });

        expect(counterInput.value).toBe('0');

        act(() => {
            fireEvent.click(clickMeBtn);
        });

        expect(counterInput.value).toBe('1');
    });
});

const Component: FC = () => {
    const [counterValue, setCounterValue] = useState<number>(0);

    const [ref] = useClickInside(() => {
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

    const [ref] = useClickInside(() => {
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
