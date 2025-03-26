import React, { useCallback, useRef, useState } from 'react';
import useEventListener from './useEventListener';
import type { StoryObj } from '@storybook/react';

type TMouseEventTemplateStory = StoryObj<typeof MouseEventTemplate>;

const MouseEventTemplate = (): React.ReactNode => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    const handler = useCallback((event: MouseEvent) => setCoords({ x: event.clientX, y: event.clientY }), [setCoords]);

    useEventListener('mousemove', handler, ref);

    return (
        <div ref={ref}>
            Mouse coordinates: {coords.x}, {coords.y}
        </div>
    );
};

export const MouseEventStory: TMouseEventTemplateStory = {
    name: 'Mouse event',
    decorators: [(): React.ReactNode => <MouseEventTemplate />]
};

type TKeyboardEventTemplateStory = StoryObj<typeof KeyboardEventTemplate>;

const KeyboardEventTemplate = (): React.ReactNode => {
    const [key, setKey] = useState('none');

    const handler = useCallback((event: KeyboardEvent) => setKey(event.key), [setKey]);

    useEventListener('keydown', handler);

    return <div>Last key pressed: {key}</div>;
};

export const KeyboardEventStory: TKeyboardEventTemplateStory = {
    name: 'Keyboard event',
    decorators: [(): React.ReactNode => <KeyboardEventTemplate />]
};

type THTMLElementTemplateStory = StoryObj<typeof HTMLElementTemplate>;

const HTMLElementTemplate = (): React.ReactNode => {
    const ref = useRef(null);

    const handler = useCallback(() => alert('Button clicked!'), []);

    useEventListener('click', handler, ref);

    return (
        <button type="button" ref={ref}>
            Click on me!
        </button>
    );
};

export const HTMLElementStory: THTMLElementTemplateStory = {
    name: 'HTML element',
    decorators: [(): React.ReactNode => <HTMLElementTemplate />]
};

export default {
    title: 'hooks/useEventListener'
};
