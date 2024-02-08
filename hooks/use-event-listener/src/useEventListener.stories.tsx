import React, { useCallback, useRef, useState } from 'react';
import { Story } from '@storybook/react';
import useEventListener from './useEventListener';

const MouseEventTemplate: Story = () => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handler = useCallback((event: MouseEvent) => setCoords({ x: event.clientX, y: event.clientY }), [setCoords]);

    useEventListener('mousemove', handler);

    return (
        <div>
            Mouse coordinates: {coords.x}, {coords.y}
        </div>
    );
};

export const MouseEvent = MouseEventTemplate.bind({});

const KeyboardEventTemplate: Story = () => {
    const [key, setKey] = useState('none');

    const handler = useCallback((event: KeyboardEvent) => setKey(event.key), [setKey]);

    useEventListener('keydown', handler);

    return <div>Last key pressed: {key}</div>;
};

export const KeyboardEvent = KeyboardEventTemplate.bind({});

const HTMLElementTemplate: Story = () => {
    const ref = useRef(null);

    const handler = useCallback(() => alert('Button clicked!'), []);

    useEventListener('click', handler);

    return (
        <button type="button" ref={ref}>
            Click on me!
        </button>
    );
};

export const HTMLElementEvent = HTMLElementTemplate.bind({});

export default {
    title: 'useEventListener'
};
