import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
// eslint-disable-next-line import/no-named-as-default
import userEvent from '@testing-library/user-event';

import CheckBox from './CheckBox';
import CheckBoxLabel from './partials/CheckBoxLabel';

interface IFormValues {
    isChecked: boolean;
}

interface IFormProps {
    defaultValues: IFormValues;
    onSubmit: (values: IFormValues) => void;
}

const Form = ({ defaultValues, onSubmit }: IFormProps): JSX.Element => {
    const { register, handleSubmit } = useForm<IFormValues>({ defaultValues });

    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            <CheckBox {...register('isChecked')}>Label</CheckBox>
            <button type="submit">Submit</button>
        </form>
    );
};

describe('components/CheckBox', () => {
    test('should render children', () => {
        const onChange = vi.fn();

        render(
            <CheckBox isChecked onChange={onChange}>
                Check box label
            </CheckBox>
        );

        expect(screen.getByText('Check box label')).toBeInTheDocument();
    });

    test('should render checked checkbox', () => {
        const onChange = vi.fn();

        render(
            <CheckBox isChecked onChange={onChange}>
                Check box label
            </CheckBox>
        );

        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('should render unchecked checkbox', () => {
        const onChange = vi.fn();

        render(
            <CheckBox isChecked={false} onChange={onChange}>
                Check box label
            </CheckBox>
        );

        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('should render disabled checkbox', () => {
        const onChange = vi.fn();

        render(
            <CheckBox isChecked isDisabled onChange={onChange}>
                Disabled check box label
            </CheckBox>
        );

        expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    test('should render indeterminate checkbox', () => {
        const onChange = vi.fn();

        render(
            <CheckBox isChecked={false} isIndeterminate onChange={onChange}>
                Indeterminate check box label
            </CheckBox>
        );

        expect(screen.getByRole('checkbox')).toBePartiallyChecked();
    });

    test('should works with react-hook-form correctly', async () => {
        const onSubmit = vi.fn();
        const defaultValues = {
            isChecked: true
        };

        render(<Form defaultValues={defaultValues} onSubmit={onSubmit} />);

        expect(screen.getByRole('checkbox')).toBeChecked();

        await userEvent.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).not.toBeChecked();

        await userEvent.click(screen.getByText('Submit'));
        expect(onSubmit).toHaveBeenCalledWith({ isChecked: false }, expect.any(Object));
    });

    test('should throw error without using context', () => {
        expect(() => render(<CheckBoxLabel>some label text</CheckBoxLabel>)).toThrow();
    });
});
