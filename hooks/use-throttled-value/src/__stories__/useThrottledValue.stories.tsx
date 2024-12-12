import React, { ChangeEvent, useEffect, useState } from 'react';
import { StoryObj } from '@storybook/react';
import useThrottledValue from '../useThrottledValue';
import styles from './useThrottledValue.stories.module.css';

const DELAY_THROTTLE = 1500;

function TemplateUseThrottledValueStory(): JSX.Element {
    const [leading, setLeading] = useState(true);
    const [trailing, setTrailing] = useState(true);

    const [inputValue, setInputValue] = useState<string>('');
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [inputThrottledValue, setInputThrottledValue] = useThrottledValue<string>(inputValue, DELAY_THROTTLE, {
        leading,
        trailing
    });
    const [mousePositionThrottled, setMousePositionThrottled] = useThrottledValue(mousePosition, DELAY_THROTTLE);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setInputValue(event.target.value);
        setInputThrottledValue(event.target.value);
    };

    const handleMouseMove = (event: MouseEvent): void => {
        setMousePosition({ x: event.clientX, y: event.clientY });
        setMousePositionThrottled({ x: event.clientX, y: event.clientY });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div>
            <div>
                <h3>1. Throttle value input</h3>
                <div className={styles.row}>
                    <button onClick={() => setLeading(p => !p)}>Toggle Leading</button>
                    <button onClick={() => setTrailing(p => !p)}>Toggle Trailing</button>
                </div>
                <p>{`Option: { leading: ${String(leading)}, trailing: ${String(trailing)} }`}</p>
                <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type something..." />
                <p>Input Value: {inputValue}</p>
                <p>Throttled Value: {inputThrottledValue}</p>
            </div>
            <hr className={styles.hr} />
            <div>
                <h3>2. Throttle value mouse position</h3>
                <div className={styles.row}>
                    <strong>Mouse Position: </strong>
                    <div className={styles.row}>
                        <p>X: {mousePosition.x}</p>
                        <p>Y: {mousePosition.y}</p>
                    </div>
                </div>
                <div className={styles.row}>
                    <strong>Throttled Mouse Position: </strong>
                    <div className={styles.row}>
                        <p>X: {mousePositionThrottled.x}</p>
                        <p>Y: {mousePositionThrottled.y}</p>
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
