import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Checkbox from './Checkbox';

const TestComponent = ({
    isCheckedByDefault = false,
    isDisabledByDefault
}: {
    isCheckedByDefault?: boolean;
    isDisabledByDefault?: boolean;
}): JSX.Element => {
    const [isChecked, setChecked] = React.useState(isCheckedByDefault);

    return (
        <Checkbox
            name="test-checkbox"
            isChecked={isChecked}
            onChange={(event, checked) => {
                setChecked(checked);
            }}
            isDisabled={isDisabledByDefault}
        >
            Test
        </Checkbox>
    );
};

describe('Checkbox', () => {
    test('switching between checked and unchecked', () => {
        // Checkbox is checked by default
        const dom = render(<TestComponent />);

        const checkboxInput = dom.container.querySelector('[name=test-checkbox]') as HTMLElement;
        const checkboxClass = dom.container.querySelector('[class=Checkbox]') as HTMLElement;

        expect(checkboxInput).toBeDefined();
        expect(checkboxClass).toBeDefined();

        expect(checkboxClass.className).toBe('Checkbox');

        // Checked
        act(() => {
            fireEvent.click(checkboxInput);
        });

        expect(checkboxClass.className).toBe('Checkbox Checkbox--isChecked');

        // Unchecked
        act(() => {
            fireEvent.click(checkboxInput);
        });

        expect(checkboxClass.className).toBe('Checkbox');
    });

    test('is not checking when disabled', () => {
        // Checkbox is checked by default
        const dom = render(<TestComponent isCheckedByDefault isDisabledByDefault />);

        const checkboxInput = dom.container.querySelector('[name=test-checkbox]') as HTMLElement;
        const checkboxClass = dom.container.querySelector(
            '[class="Checkbox Checkbox--isChecked Checkbox--isDisabled"]'
        ) as HTMLElement;

        expect(checkboxInput).toBeDefined();
        expect(checkboxClass).toBeDefined();

        // Trying to check
        act(() => {
            fireEvent.click(checkboxInput);
        });

        // Check that className is still the same
        expect(checkboxClass.className).toBe('Checkbox Checkbox--isChecked Checkbox--isDisabled');
    });
});
