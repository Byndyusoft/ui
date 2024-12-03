import React, { ChangeEvent, useEffect, useState } from 'react';
import type { StoryObj } from '@storybook/react';
import useThrottledCallback, { TThrottledCallback } from '../useThrottledCallback';
import useThrottledValue from '../useThrottledValue';
import './useThrottle.stories.css';

const DELAY_THROTTLE = 1500;

const ThrottleClickStory = (): JSX.Element => {
    const [count, setCount] = useState<number>(0);
    const [noLeadingCount, setNoLeadingCount] = useState<number>(0);
    const [noTrailingCount, setNoTrailingCount] = useState<number>(0);

    const throttledHandleClickLeading: TThrottledCallback = useThrottledCallback(() => {
        setCount(prevCount => prevCount + 1);
    }, DELAY_THROTTLE);

    const throttledHandleClickNoLeading: TThrottledCallback = useThrottledCallback(
        () => {
            setNoLeadingCount(prevCount => prevCount + 1);
        },
        DELAY_THROTTLE,
        { leading: false }
    );

    const throttledHandleClickNoTrailing: TThrottledCallback = useThrottledCallback(
        () => {
            setNoTrailingCount(prevCount => prevCount + 1);
        },
        DELAY_THROTTLE,
        { trailing: false }
    );

    return (
        <div>
            <h2>useThrottledCallback</h2>
            <div className="row">
                <hr className="hr" />
                <div className="column card">
                    <h3>Default</h3>
                    <code className="code-block">
                        {`
const handleClick = useThrottle(() => {
    setCount(prevCount => prevCount + 1);
}, 1500)
                        `}
                    </code>
                    <div className="row">
                        <p>Count: {count}</p>
                        <button className="btn" onClick={throttledHandleClickLeading}>
                            Click me
                        </button>
                    </div>
                </div>
                <div className="card">
                    <h3>Off leading</h3>
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
                    <h3>Off trailing</h3>
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

function ThrottleEventStory(): JSX.Element {
    const [inputValue, setInputValue] = useState<string>('');
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setInputValue(event.target.value);
    };

    const handleMouseMove = (event: MouseEvent): void => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const inputThrottledValue = useThrottledValue(inputValue, DELAY_THROTTLE);
    const mousePositionThrottledValue = useThrottledValue(mousePosition, DELAY_THROTTLE);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div>
            <h2>useThrottledValue</h2>
            <hr className="hr" />
            <div>
                <h3>Throttle input</h3>
                <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type something..." />
                <p>Input Value: {inputValue}</p>
                <p>Throttled Value: {inputThrottledValue}</p>
            </div>
            <hr className="hr" />
            <div>
                <h3>Throttle mouse position</h3>
                <div className="row">
                    <strong>Mouse Position: </strong>
                    <div className="row">
                        <p>X: {mousePosition.x}</p>
                        <p>Y: {mousePosition.y}</p>
                    </div>
                </div>
                <div className="row">
                    <strong>Throttled Mouse Position: </strong>
                    <div className="row">
                        <p>X: {mousePositionThrottledValue.x}</p>
                        <p>Y: {mousePositionThrottledValue.y}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const ThrottleClick: StoryObj<typeof ThrottleClickStory> = {
    name: 'useThrottledCallback',
    decorators: [() => <ThrottleClickStory />]
};

export const ThrottleInput: StoryObj<typeof ThrottleEventStory> = {
    name: 'useThrottledValue',
    decorators: [() => <ThrottleEventStory />]
};

export default {
    title: 'hooks/useThrottle'
};
