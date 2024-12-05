import React, { useState } from 'react';
import { StoryObj } from '@storybook/react';
import useThrottledCallback, { TThrottledCallback } from '../useThrottledCallback';
import cls from './useThrottledCallback.stories.module.css';

const DELAY_THROTTLE = 1500;

const UseThrottledCallbackStory = (): JSX.Element => {
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
            <div className={`${cls.column} ${cls.card}`}>
                <h3>Default</h3>
                <code className={cls.code_block}>
                    {`
const handleClick = useThrottledCallback(() => {
    setCount(prevCount => prevCount + 1);
}, 1500)
                        `}
                </code>
                <div className={cls.row}>
                    <p>Count: {count}</p>
                    <button className={cls.btn} onClick={throttledHandleClickLeading}>
                        Click me
                    </button>
                </div>
            </div>
            <div className={cls.card}>
                <h3>Off leading</h3>
                <ul>
                    <li>The function will not be called immediately on the first call</li>
                    <li>The function will be called only after the delay is completed</li>
                </ul>
                <pre className={cls.code_block}>
                    {`
const handleClick = useThrottledCallback(() => {
    setCount(prevCount => prevCount + 1);
},
1500,
{ leading: false })
                        `}
                </pre>
                <div className={cls.row}>
                    <p>Count: {noLeadingCount}</p>
                    <button className={cls.btn} onClick={throttledHandleClickNoLeading}>
                        Click me
                    </button>
                </div>
            </div>
            <div className={cls.card}>
                <h3>Off trailing</h3>
                <ul>
                    <li>The function will not be called after the delay is completed</li>
                    <li>The function will be called only on the first call if the leading option is set to true</li>
                </ul>
                <pre className={cls.code_block}>
                    {`
const handleClick = useThrottledCallback(() => {
    setCount(prevCount => prevCount + 1);
},
1500,
{ trailing: false })
                        `}
                </pre>
                <div className={cls.row}>
                    <p>Count: {noTrailingCount}</p>
                    <button className={cls.btn} onClick={throttledHandleClickNoTrailing}>
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
