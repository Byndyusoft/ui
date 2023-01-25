import useClickOutside from './useClickOutside';
import React, { useCallback, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const Setup = (props: { onClick: () => void }): JSX.Element => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);

    const handle = useCallback(props.onClick, [props.onClick]);

    useClickOutside(handle, ref1, ref2);

    return (
        <div aria-label="container">
            <button type="button" aria-label="button-1" ref={ref1}>Click_1</button>
            <button type="button" aria-label="button-2" ref={ref2}>Click_2</button>
        </div>

    );
};

describe('hooks/useClickOutside', () => {
    test('add two refs', () => {
        const onClick = jest.fn();
        render(<Setup onClick={onClick} />);

        userEvent.click(screen.getByLabelText('button-1'));
        expect(onClick).toBeCalledTimes(0);

        userEvent.click(screen.getByLabelText('button-2'));
        expect(onClick).toBeCalledTimes(0);

        userEvent.click(screen.getByLabelText('container'));
        expect(onClick).toBeCalledTimes(1);
    });
});
