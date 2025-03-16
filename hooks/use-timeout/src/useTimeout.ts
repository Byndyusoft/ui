import { Callback, TimeoutId } from '@byndyusoft-ui/types';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import { useEffect, useRef } from 'react';

export interface IUseTimeout {
    start: Callback;
    stop: Callback;
}

export default function useTimeout(callback: Callback, delay: number): IUseTimeout {
    const savedCallback = useLatestRef(callback);
    const timer = useRef<TimeoutId | null>(null);

    console.log('useTimeout RENDER', timer.current);
    const stop = (): void => {
        console.log('timer', timer.current);
        // console.log('timer if', Boolean(timer.current));
        if (timer.current) {
            console.log('CLEAR IF TIMER')
            clearTimeout(timer.current);
            timer.current = null;
        }
    };

    const start = (): void => {
        stop();
        timer.current = setTimeout(() => {
            savedCallback.current();
        }, delay);
    };

    useEffect(() => {
        console.log('USE EFFECT STOP')
        return stop;
    }, []);

    return {
        start,
        stop
    };
}
