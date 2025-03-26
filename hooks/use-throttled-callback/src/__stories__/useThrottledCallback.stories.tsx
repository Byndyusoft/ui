import React, { useState } from 'react';
import { StoryObj } from '@storybook/react';
import useThrottledCallback from '../useThrottledCallback';
import styles from './useThrottledCallback.stories.module.css';

const DELAY_THROTTLE = 1500;

const UseThrottledCallbackStory = (): React.ReactNode => {
    const [count, setCount] = useState<number>(0);
    const [noLeadingCount, setNoLeadingCount] = useState<number>(0);
    const [noTrailingCount, setNoTrailingCount] = useState<number>(0);

    const throttledHandleClickLeading = useThrottledCallback(() => {
        setCount(prevCount => prevCount + 1);
    }, DELAY_THROTTLE);

    const throttledHandleClickNoLeading = useThrottledCallback(
        () => {
            setNoLeadingCount(prevCount => prevCount + 1);
        },
        DELAY_THROTTLE,
        { leading: false }
    );

    const throttledHandleClickNoTrailing = useThrottledCallback(
        () => {
            setNoTrailingCount(prevCount => prevCount + 1);
        },
        DELAY_THROTTLE,
        { trailing: false }
    );

    return (
        <div>
            <div className={`${styles.column} ${styles.card}`}>
                <h3>Default</h3>
                <code className={styles.code_block}>
                    {`
const handleClick = useThrottledCallback(() => {
    setCount(prevCount => prevCount + 1);
}, 1500)
                        `}
                </code>
                <div className={styles.row}>
                    <p>Count: {count}</p>
                    <button className={styles.btn} onClick={throttledHandleClickLeading}>
                        Click me
                    </button>
                </div>
            </div>
            <div className={styles.card}>
                <h3>Off leading</h3>
                <ul>
                    <li>The function will not be called immediately on the first call</li>
                    <li>The function will be called only after the delay is completed</li>
                </ul>
                <pre className={styles.code_block}>
                    {`
const handleClick = useThrottledCallback(() => {
    setCount(prevCount => prevCount + 1);
},
1500,
{ leading: false })
                        `}
                </pre>
                <div className={styles.row}>
                    <p>Count: {noLeadingCount}</p>
                    <button className={styles.btn} onClick={throttledHandleClickNoLeading}>
                        Click me
                    </button>
                </div>
            </div>
            <div className={styles.card}>
                <h3>Off trailing</h3>
                <ul>
                    <li>The function will not be called after the delay is completed</li>
                    <li>The function will be called only on the first call if the leading option is set to true</li>
                </ul>
                <pre className={styles.code_block}>
                    {`
const handleClick = useThrottledCallback(() => {
    setCount(prevCount => prevCount + 1);
},
1500,
{ trailing: false })
                        `}
                </pre>
                <div className={styles.row}>
                    <p>Count: {noTrailingCount}</p>
                    <button className={styles.btn} onClick={throttledHandleClickNoTrailing}>
                        Click me
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ThrottledCallbackStory: StoryObj<typeof UseThrottledCallbackStory> = {
    name: 'Throttled click',
    render: UseThrottledCallbackStory
};

export default {
    title: 'hooks/useThrottledCallback'
};
