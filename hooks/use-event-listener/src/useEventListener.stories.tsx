import React, { useCallback, useRef, useState } from 'react';
import useEventListener from './useEventListener';
import type { Meta, StoryObj } from '@storybook/react';

type TMouseEventTemplateStory = StoryObj<typeof MouseEventTemplate>;

const MouseEventTemplate = (): JSX.Element => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handler = useCallback((event: MouseEvent) => setCoords({ x: event.clientX, y: event.clientY }), [setCoords]);

    useEventListener('mousemove', handler);

    return (
        <div>
            Mouse coordinates: {coords.x}, {coords.y}
        </div>
    );
};
export const MouseEvent: TMouseEventTemplateStory = {
    decorators: [() => <MouseEventTemplate />]
};

type TKeyboardEventTemplateStory = StoryObj<typeof KeyboardEventTemplate>;

const KeyboardEventTemplate = (): JSX.Element => {
    const [key, setKey] = useState('none');

    const handler = useCallback((event: KeyboardEvent) => setKey(event.key), [setKey]);

    useEventListener('keydown', handler);

    return <div>Last key pressed: {key}</div>;
};

export const KeyboardEvent: TKeyboardEventTemplateStory = {
    decorators: [() => <KeyboardEventTemplate />]
};

type THTMLElementTemplateStory = StoryObj<typeof HTMLElementTemplate>;

const HTMLElementTemplate = (): JSX.Element => {
    const ref = useRef(null);

    const handler = useCallback(() => alert('Button clicked!'), []);

    useEventListener('click', handler);

    return (
        <button type="button" ref={ref}>
            Click on me!
        </button>
    );
};

export const HTMLElement: THTMLElementTemplateStory = {
    decorators: [() => <HTMLElementTemplate />]
};

const meta: Meta = {
    title: 'hooks/useEventListener'
};
export default meta;
