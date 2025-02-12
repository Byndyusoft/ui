import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';
import { InputProps } from '../input.types';

const setup = (props: InputProps = {}) => {
    return render(<Input {...props} />);
};

describe('Input Component', () => {
    test('renders input element', () => {
        const { getByRole } = setup();
        const inputElement = getByRole('textbox');
        expect(inputElement).toBeInTheDocument();
    });

    test('applies the correct classes based on props', () => {
        const { getByRole } = setup({
            size: 'l',
            variant: 'line',
            className: 'custom-class',
            inputClassName: 'custom-input-class'
        });
        const inputContainer = getByRole('textbox').closest('div');
        expect(inputContainer).toHaveClass('input_container', 'line', 'l', 'custom-class');
        expect(getByRole('textbox')).toHaveClass('input', 'custom-input-class');
    });

    test('applies disabled state', () => {
        const { getByRole } = setup({ disabled: true });
        const inputElement = getByRole('textbox');
        expect(inputElement).toBeDisabled();
        expect(inputElement.closest('div')).toHaveClass('disabled');
    });

    test('applies invalid state', () => {
        const { getByRole } = setup({ isInvalid: true });
        const inputContainer = getByRole('textbox').closest('div');
        expect(inputContainer).toHaveClass('invalid');
    });

    test('renders left and right components', () => {
        const LeftComponent = <div data-testid="left-component">Left</div>;
        const RightComponent = <div data-testid="right-component">Right</div>;

        const { getByTestId } = setup({ leftComponent: LeftComponent, rightComponent: RightComponent });

        expect(getByTestId('left-component')).toBeInTheDocument();
        expect(getByTestId('right-component')).toBeInTheDocument();
    });

    test('applies styles correctly', () => {
        const containerStyle = { padding: '10px' };
        const inputStyle = { color: 'red' };
        const { getByRole } = setup({ style: containerStyle, inputStyle: inputStyle });
        const inputContainer = getByRole('textbox').closest('div');
        const inputElement = getByRole('textbox');

        expect(inputContainer).toHaveStyle('padding: 10px');
        expect(inputElement).toHaveStyle('color: red');
    });

    test('handles input change', async () => {
        const handleChange = jest.fn();
        const { getByRole } = setup({ onChange: handleChange });
        const inputElement = getByRole('textbox') as HTMLInputElement;

        await userEvent.type(inputElement, 'test');

        expect(handleChange).toHaveBeenCalledTimes(4);
        expect(inputElement).toHaveValue('test');
    });
});
