import React, { ChangeEvent, useEffect, useState } from 'react';
import type { StoryObj } from '@storybook/react';
import useThrottle from '../useThrottle';
import './useThrottle.stories.css';

const DELAY_THROTTLE = 1500;

const ThrottleClickStory = (): JSX.Element => {
    const [leadingCount, setLeadingCount] = useState<number>(0);
    const [noLeadingCount, setNoLeadingCount] = useState<number>(0);
    const [noTrailingCount, setNoTrailingCount] = useState<number>(0);

    const throttledHandleClickLeading = useThrottle(() => {
        setLeadingCount(prevCount => prevCount + 1);
    }, DELAY_THROTTLE);

    const throttledHandleClickNoLeading = useThrottle(
        () => {
            setNoLeadingCount(prevCount => prevCount + 1);
        },
        DELAY_THROTTLE,
        { leading: false }
    );

    const throttledHandleClickNoTrailing = useThrottle(
        () => {
            setNoTrailingCount(prevCount => prevCount + 1);
        },
        DELAY_THROTTLE,
        { trailing: false }
    );

    return (
        <div>
            <h2>Throttle click</h2>
            <div className="row">
                <hr className="hr" />
                <div className="column card">
                    <h3>useThrottle default</h3>
                    <code className="code-block">
                        {`
const handleClick = useThrottle(() => {
    setCount(prevCount => prevCount + 1);
}, 1500)
                        `}
                    </code>
                    <div className="row">
                        <p>Count: {leadingCount}</p>
                        <button className="btn" onClick={throttledHandleClickLeading}>
                            Click me
                        </button>
                    </div>
                </div>
                <div className="card">
                    <h3>useThrottle No Leading</h3>
                    <ul>
                        <li>The function will not be called immediately on the first call</li>
                        <li>The function will be called only after the delay is completed</li>
                    </ul>
                    <pre className="code-block">
                        {`
const handleClick = useThrottle(() => {
    setCount(prevCount => prevCount + 1);
},
1500,
{ leading: false })
                        `}
                    </pre>
                    <div className="row">
                        <p>Count: {noLeadingCount}</p>
                        <button className="btn" onClick={throttledHandleClickNoLeading}>
                            Click me
                        </button>
                    </div>
                </div>
                <div className="card">
                    <h3>useThrottle No Trailing</h3>
                    <ul>
                        <li>The function will not be called after the delay is completed</li>
                        <li>The function will be called only on the first call if the leading option is set to true</li>
                    </ul>
                    <pre className="code-block">
                        {`
const handleClick = useThrottle(() => {
    setCount(prevCount => prevCount + 1);
},
1500,
{ trailing: false })
                        `}
                    </pre>
                    <div className="row">
                        <p>Count: {noTrailingCount}</p>
                        <button className="btn" onClick={throttledHandleClickNoTrailing}>
                            Click me
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function ThrottleInputStory(): JSX.Element {
    const [inputValue, setInputValue] = useState<string>('');
    const [throttledValue, setThrottledValue] = useState<string>('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const throttledHandleInputChange = useThrottle<string>(value => {
        setThrottledValue(value);
    }, DELAY_THROTTLE);

    React.useEffect(() => {
        throttledHandleInputChange(inputValue);
    }, [inputValue, throttledHandleInputChange]);

    return (
        <div>
            <h2>Throttle input</h2>
            <hr className="hr" />
            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type something..." />
            <p>Input Value: {inputValue}</p>
            <p>Throttled Value: {throttledValue}</p>
        </div>
    );
}

const ThrottleMouseMoveStory = (): JSX.Element => {
    const [rawMousePosition, setRawMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [throttledMousePosition, setThrottledMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleMouseMove = (event: MouseEvent) => {
        setRawMousePosition({ x: event.clientX, y: event.clientY });
    };

    const throttledHandleMouseMove = useThrottle<MouseEvent>(event => {
        setThrottledMousePosition({ x: event.clientX, y: event.clientY });
    }, DELAY_THROTTLE);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousemove', throttledHandleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousemove', throttledHandleMouseMove);
        };
    }, []);

    return (
        <div>
            <h2>Throttle mouse position</h2>
            <hr className="hr" />
            <div>
                <h3>Mouse Position</h3>
                <div className="row">
                    <p>X: {rawMousePosition.x}</p>
                    <p>Y: {rawMousePosition.y}</p>
                </div>
            </div>
            <div>
                <h3>Throttled Mouse Position</h3>
                <div className="row">
                    <p>X: {throttledMousePosition.x}</p>
                    <p>Y: {throttledMousePosition.y}</p>
                </div>
            </div>
        </div>
    );
};

export const ThrottleClick: StoryObj<typeof ThrottleClickStory> = {
    name: 'useThrottle click',
    decorators: [() => <ThrottleClickStory />]
};

export const ThrottleInput: StoryObj<typeof ThrottleInputStory> = {
    name: 'useThrottle input',
    decorators: [() => <ThrottleInputStory />]
};

export const ThrottleMouseMove: StoryObj<typeof ThrottleMouseMoveStory> = {
    name: 'useThrottle mouse move',
    decorators: [() => <ThrottleMouseMoveStory />]
};

export default {
    title: 'hooks/useThrottle'
};
