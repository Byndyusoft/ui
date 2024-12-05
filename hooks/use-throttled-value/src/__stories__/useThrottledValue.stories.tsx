import React, { ChangeEvent, useEffect, useState } from 'react';
import { StoryObj } from '@storybook/react';
import useThrottledValue from '../useThrottledValue';
import './useThrottledValue.stories.css';

const DELAY_THROTTLE = 1500;

function TemplateUseThrottledValueStory(): JSX.Element {
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

export const ThrottledValueStory: StoryObj<typeof TemplateUseThrottledValueStory> = {
    render: TemplateUseThrottledValueStory
};

export default {
    title: 'hooks/useThrottledValue'
};
