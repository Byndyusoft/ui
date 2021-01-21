import { useState, useEffect } from 'react';
import useInterval from './useInterval';

interface ICountdown {
    count: number;
    onStop?: () => void;
}

function useCountdown({ count, onStop }: ICountdown): { count: number; stop: () => void; start: () => void } {
    const [counter, setCounter] = useState(count);

    const { start: startIterval, stop } = useInterval(() => {
        if (counter > 0) {
            setCounter(prev => prev - 1);
        }
    });

    useEffect(() => {
        startIterval(1000);
    }, [startIterval]);

    if (count === 0) {
        stop();
    }

    if (count === 0 && onStop) {
        onStop();
    }

    const reset = () => {
        setCounter(count);
        startIterval(1000);
    };

    return { count: counter, stop, start: reset };
}

export default useCountdown;
