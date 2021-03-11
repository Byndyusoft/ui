import { useState, useEffect } from 'react';
import useInterval from './useInterval';

interface ICountdownParams {
    count: number;
    onStop?: () => void;
}

interface ICountdown {
    (params: ICountdownParams): { count: number; stop: () => void; start: () => void };
}

const useCountdown: ICountdown = ({ count, onStop }) => {
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
};

export default useCountdown;
