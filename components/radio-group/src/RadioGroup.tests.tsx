import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RadioGroup from './components/RadioGroup';
import Radio from './components/Radio';

const TestComponent = ({ selectedOption = 'apple' }: { selectedOption?: string }) => {
    const [value, setValue] = useState(selectedOption);

    return (
        <>
            <strong>Fruit: {value}</strong>
            <RadioGroup value={value} name="fruit" onChange={setValue}>
                <Radio value="apple">Apple</Radio>
                <Radio value="banana">Banana</Radio>
                <Radio value="pineapple">Pineapple</Radio>
            </RadioGroup>
        </>
    );
};

const setup = () => render(<TestComponent />);

describe('RadioGroup', () => {
    test('renders radio group with labels', () => {
        setup();

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.getByText('Pineapple')).toBeInTheDocument();
    });

    test('selecting option is changing value', async () => {
        setup();

        const bananaRadio = screen.getByRole('radio', { name: 'Banana' });
        await userEvent.click(bananaRadio);

        expect(screen.getByText('Fruit: banana')).toBeInTheDocument();
    });
});
