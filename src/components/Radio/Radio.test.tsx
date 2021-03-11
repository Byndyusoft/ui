import React, { useState } from 'react';
import Radio from '.';
import { render, screen, act, fireEvent } from '@testing-library/react';

const TestComponent = ({ isDisabled }: { isDisabled?: boolean }): JSX.Element => {
    const [isChecked, setChecked] = useState<boolean>(false);

    return (
        <Radio name="test-radio" isChecked={isChecked} onChange={setChecked} isDisabled={isDisabled}>
            Test
        </Radio>
    );
};

describe('Radio', () => {
    test('checks and unchecks', () => {
        render(<TestComponent />);

        const radioButton = screen.getByRole('button');
        const radioValue = screen.getByRole('radio') as HTMLInputElement;

        expect(radioButton).toBeInTheDocument();
        expect(radioValue).toBeInTheDocument();

        expect(radioValue.checked).toBeFalsy();

        act(() => {
            fireEvent.click(radioButton);
        });

        expect(radioValue.checked).toBeTruthy();
    });

    test('cannot check disabled radio', () => {
        render(<TestComponent isDisabled />);

        const radioButton = screen.getByRole('button');
        const radioValue = screen.getByRole('radio') as HTMLInputElement;

        expect(radioButton).toBeInTheDocument();
        expect(radioValue).toBeInTheDocument();

        expect(radioValue.checked).toBeFalsy();

        act(() => {
            fireEvent.click(radioButton);
        });

        expect(radioValue.checked).toBeFalsy();
    });
});
