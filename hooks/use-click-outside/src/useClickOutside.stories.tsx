import React, { forwardRef, MutableRefObject, useRef } from 'react';
import { StoryObj } from '@storybook/react';
import useClickOutside from './useClickOutside';

export default {
    title: 'hooks/useCLickOutside'
};

const Block = forwardRef<HTMLDivElement>(function Block(props, ref) {
    return <div ref={ref} style={{ height: '2rem', width: '20rem', background: 'violet', marginBottom: '2rem', lineHeight: '2rem', padding: '1rem' }} >click outside</div>;
});

const Template = (): JSX.Element => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const handleClickOutside = () => {
        alert('clickOutside');
    };

    useClickOutside(handleClickOutside, ref1, ref2, ref3);

    return (
        <>
            <Block ref={ref1} />
            <Block ref={ref2} />
            <Block ref={ref3} />
        </>
    );
};

type Story = StoryObj<typeof Template>;

export const HookStory: Story = {
    name: 'useCLickOutside',
    render: Template
};
