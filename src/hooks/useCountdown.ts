import { useEffect, useState } from 'react';

interface ICountdown {
    count: number;
    onStop?: () => void;
}

function useCountdown({ count, onStop }: ICountdown): number {
    const [counter, setCounter] = useState(count);

    useEffect(() => {
        if (counter === 0 && onStop) {
            onStop();
        }
        if (counter > 0) {
            setTimeout(() => setCounter(counter - 1), 1000);
        }
    }, [counter]);

    return counter;
}

export default useCountdown;
