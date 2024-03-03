import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import useClickOutside from './useClickOutside';

const Setup = (props: { onClick: () => void }): JSX.Element => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);

    useClickOutside(props.onClick, ref1, ref2);

    return (
        <div aria-label="container">
            <button type="button" aria-label="button-1" ref={ref1}>
                Click_1
            </button>
            <button type="button" aria-label="button-2" ref={ref2}>
                Click_2
            </button>
        </div>
    );
};

describe('hooks/useClickOutside', () => {
    test('add two refs', async () => {
        const onClick = jest.fn();
        render(<Setup onClick={onClick} />);

        await userEvent.click(screen.getByLabelText('button-1'));

        expect(onClick).toBeCalledTimes(0);

        await userEvent.click(screen.getByLabelText('button-2'));

        expect(onClick).toBeCalledTimes(0);

        await userEvent.click(screen.getByLabelText('container'));

        expect(onClick).toBeCalledTimes(1);
    });
});
