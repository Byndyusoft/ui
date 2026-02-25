import React, { useRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import useClickOutside from './useClickOutside';

const Setup = (props: { onClick: () => void }): JSX.Element => {
    const ref1 = useRef<HTMLButtonElement>(null);
    const ref2 = useRef<HTMLButtonElement>(null);

    useClickOutside(props.onClick, [ref1, ref2]);

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

const SetupDisabled = (props: { onClick: () => void; disabled: boolean }): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(props.onClick, [ref], { disabled: props.disabled });

    return (
        <div aria-label="container">
            <div ref={ref} aria-label="inner">
                inner
            </div>
        </div>
    );
};

const SetupMultipleInstances = (): JSX.Element => {
    const refA = useRef<HTMLDivElement>(null);
    const refB = useRef<HTMLDivElement>(null);
    const [clicked, setClicked] = useState<null | 'A' | 'B'>(null);

    useClickOutside(() => setClicked('A'), [refA]);
    useClickOutside(() => setClicked('B'), [refB]);

    return (
        <div aria-label="page">
            <div ref={refA} aria-label="block-a">
                Block A
            </div>
            <div ref={refB} aria-label="block-b">
                Block B
            </div>
            <div aria-label="outside">Outside</div>
            {clicked != null && <span data-testid="clicked">{clicked}</span>}
        </div>
    );
};

describe('hooks/useClickOutside', () => {
    test('calls handler when click is outside all refs', async () => {
        const onClick = vi.fn();
        render(<Setup onClick={onClick} />);

        await userEvent.click(screen.getByLabelText('button-1'));
        expect(onClick).not.toHaveBeenCalled();

        await userEvent.click(screen.getByLabelText('button-2'));
        expect(onClick).not.toHaveBeenCalled();

        await userEvent.click(screen.getByLabelText('container'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('does not call handler when disabled is true', async () => {
        const onClick = vi.fn();
        render(<SetupDisabled onClick={onClick} disabled />);

        await userEvent.click(screen.getByLabelText('container'));
        expect(onClick).not.toHaveBeenCalled();
    });

    test('calls handler when disabled is false', async () => {
        const onClick = vi.fn();
        render(<SetupDisabled onClick={onClick} disabled={false} />);

        await userEvent.click(screen.getByLabelText('container'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('multiple instances: only handler whose refs do not contain target is called', async () => {
        render(<SetupMultipleInstances />);

        await userEvent.click(screen.getByLabelText('block-b'));
        expect(screen.getByTestId('clicked')).toHaveTextContent('A');

        await userEvent.click(screen.getByLabelText('block-a'));
        expect(screen.getByTestId('clicked')).toHaveTextContent('B');

        await userEvent.click(screen.getByLabelText('outside'));
        expect(screen.getByTestId('clicked')).toHaveTextContent('B');
    });
});
