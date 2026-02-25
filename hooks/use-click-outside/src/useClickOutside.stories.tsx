import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { StoryObj } from '@storybook/react';
import useClickOutside from './useClickOutside';

export default {
    title: 'hooks/useClickOutside'
};

const Block = forwardRef<HTMLDivElement>(
    (props, ref): JSX.Element => (
        <div
            ref={ref}
            style={{
                height: '2rem',
                width: '20rem',
                background: 'violet',
                marginBottom: '2rem',
                lineHeight: '2rem',
                padding: '1rem'
            }}
        >
            click outside
        </div>
    )
);

Block.displayName = 'Block';

const MultipleRefsTemplate = (): JSX.Element => {
    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);
    const ref3 = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((): void => {
        alert('clickOutside');
    }, []);

    useClickOutside(handleClickOutside, [ref1, ref2, ref3]);

    return (
        <>
            <Block ref={ref1} />
            <Block ref={ref2} />
            <Block ref={ref3} />
        </>
    );
};

export const MultipleRefsStory: StoryObj<typeof MultipleRefsTemplate> = {
    name: 'Multiple refs',
    render: () => <MultipleRefsTemplate />
};

const DisabledTemplate = (): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);
    const [disabled, setDisabled] = useState(false);
    const [lastAction, setLastAction] = useState<string>('none');

    const handleClickOutside = useCallback((): void => {
        setLastAction('clickOutside');
    }, []);

    useClickOutside(handleClickOutside, [ref], { disabled });

    return (
        <div style={{ padding: '1rem' }}>
            <p>Disabled: {String(disabled)}</p>
            <button type="button" onClick={(): void => setDisabled(v => !v)}>
                Toggle disabled
            </button>
            <div
                ref={ref}
                style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'lightblue',
                    width: '20rem'
                }}
            >
                Click outside this block to trigger handler (when not disabled)
            </div>
            <p>Last action: {lastAction}</p>
        </div>
    );
};

export const DisabledStory: StoryObj<typeof DisabledTemplate> = {
    name: 'Disabled option',
    render: () => <DisabledTemplate />
};

const DropdownTemplate = (): JSX.Element => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const handleClickOutside = useCallback((): void => {
        setOpen(false);
    }, []);

    useClickOutside(handleClickOutside, [triggerRef, panelRef]);

    return (
        <div style={{ padding: '1rem' }}>
            <button
                ref={triggerRef}
                type="button"
                onClick={(): void => setOpen(v => !v)}
                style={{ marginBottom: '0.5rem' }}
            >
                {open ? 'Close' : 'Open'} dropdown
            </button>
            {open && (
                <div
                    ref={panelRef}
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        background: 'white',
                        width: '12rem'
                    }}
                >
                    Dropdown content. Click outside to close.
                </div>
            )}
        </div>
    );
};

export const DropdownStory: StoryObj<typeof DropdownTemplate> = {
    name: 'Dropdown (close on outside click)',
    render: () => <DropdownTemplate />
};
