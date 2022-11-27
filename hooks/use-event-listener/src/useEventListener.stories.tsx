import React, { useCallback, useRef, useState } from 'react';
import { Story } from '@storybook/react';
import useEventListener from './useEventListener';

const MouseEventTemplate: Story = () => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handle = useCallback(({ clientX, clientY }) => setCoords({ x: clientX, y: clientY }), [setCoords]);

    useEventListener('mousemove', handle);

    return (
        <div>
            Mouse coordinates: {coords.x}, {coords.y}
        </div>
    );
};

export const MouseEvent = MouseEventTemplate.bind({});

const KeyboardEventTemplate: Story = () => {
    const [key, setKey] = useState('none');

    const handle = useCallback(event => setKey(event.key), [setKey]);

    useEventListener('keydown', handle);

    return <div>Last key pressed: {key}</div>;
};

export const KeyboardEvent = KeyboardEventTemplate.bind({});

const HTMLElementTemplate: Story = () => {
    const ref = useRef(null);

    const handle = useCallback(() => alert('Button clicked!'), []);

    useEventListener('click', handle);

    return (
        <button type="button" ref={ref}>
            Click on me!
        </button>
    );
};

export const HTMLElementEvent = HTMLElementTemplate.bind({});
