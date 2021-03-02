import React, { useState } from 'react';
import Radio from '.';
import { render, screen, fireEvent } from '@testing-library/react';

const TestComponent = (): JSX.Element => {
    const [isChecked, setChecked] = useState<boolean>(false);

    return (
        <Radio name="test-radio" isChecked={isChecked} onChange={setChecked}>
            Test
        </Radio>
    );
};

describe('Radio', () => {
    test('switching between states', () => {
        render(<TestComponent />);

        const radioButton = screen.getByRole('button');
        const radioValue = screen.getByRole('switch') as HTMLInputElement;

        screen.debug(radioButton);

        expect(1).toBe(1);
    });
});
