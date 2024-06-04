import React, { useCallback, useRef, useState } from 'react';
import useEventListener from './useEventListener';
import type { Meta, StoryObj } from '@storybook/react';

type MouseEventTemplateStory = StoryObj<typeof MouseEventTemplate>;

const MouseEventTemplate = () => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handler = useCallback((event: MouseEvent) => setCoords({ x: event.clientX, y: event.clientY }), [setCoords]);

    useEventListener('mousemove', handler);

    return (
        <div>
            Mouse coordinates: {coords.x}, {coords.y}
        </div>
    );
};
export const MouseEvent: MouseEventTemplateStory = {
    decorators: [() => <MouseEventTemplate />]
};

type KeyboardEventTemplateStory = StoryObj<typeof KeyboardEventTemplate>;

const KeyboardEventTemplate = () => {
    const [key, setKey] = useState('none');

    const handler = useCallback((event: KeyboardEvent) => setKey(event.key), [setKey]);

    useEventListener('keydown', handler);

    return <div>Last key pressed: {key}</div>;
};

export const KeyboardEvent: KeyboardEventTemplateStory = {
    decorators: [() => <KeyboardEventTemplate />]
};

type HTMLElementTemplateStory = StoryObj<typeof HTMLElementTemplate>;

const HTMLElementTemplate = () => {
    const ref = useRef(null);

    const handler = useCallback(() => alert('Button clicked!'), []);

    useEventListener('click', handler);

    return (
        <button type="button" ref={ref}>
            Click on me!
        </button>
    );
};

export const HTMLElement: HTMLElementTemplateStory = {
    decorators: [() => <HTMLElementTemplate />]
};

const meta: Meta = {
    title: 'hooks/useEventListener'
};
export default meta;
