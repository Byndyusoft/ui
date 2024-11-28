import React, { ChangeEvent, useEffect, useState } from 'react';
import type { StoryObj } from '@storybook/react';
import useThrottle from './useThrottle';

const DELAY_THROTTLE = 1500;

function ThrottleInputDemo() {
    const [inputValue, setInputValue] = useState<string>('');
    const [throttledValue, setThrottledValue] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const throttledHandleInputChange = useThrottle((value: string) => {
        setThrottledValue(value);
    }, DELAY_THROTTLE);

    React.useEffect(() => {
        throttledHandleInputChange(inputValue);
    }, [inputValue, throttledHandleInputChange]);

    return (
        <div>
            <h1>Throttle Input Demo</h1>
            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type something..." />
            <p>Input Value: {inputValue}</p>
            <p>Throttled Value: {throttledValue}</p>
        </div>
    );
}

function ThrottleClickDemo() {
    const [count, setCount] = useState<number>(0);

    const throttledHandleClick = useThrottle(() => {
        setCount(prevCount => prevCount + 1);
    }, DELAY_THROTTLE);

    return (
        <div>
            <h1>Throttle Click Demo</h1>
            <button onClick={throttledHandleClick}>Click me</button>
            <p>Count: {count}</p>
        </div>
    );
}

function ThrottleMouseMoveDemo() {
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleMouseMove = (event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const throttledHandleMouseMove = useThrottle((event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    }, DELAY_THROTTLE);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        throttledHandleMouseMove(mousePosition);
    }, [mousePosition, throttledHandleMouseMove]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0'
            }}
        >
            <div style={{ fontSize: '48px', textAlign: 'center' }}>
                <p>Mouse X: {mousePosition.x}</p>
                <p>Mouse Y: {mousePosition.y}</p>
                <p>Mouse X: {mousePosition.x}</p>
                <p>Mouse Y: {mousePosition.y}</p>
            </div>
        </div>
    );
}

export const ThrottleInput: StoryObj<typeof ThrottleInputDemo> = {
    decorators: [() => <ThrottleInputDemo />]
};

export const ThrottleClick: StoryObj<typeof ThrottleClickDemo> = {
    decorators: [() => <ThrottleClickDemo />]
};

export const ThrottleMouseMove: StoryObj<typeof ThrottleMouseMoveDemo> = {
    decorators: [() => <ThrottleMouseMoveDemo />]
};

export default {
    title: 'hooks/useThrottle'
};
