import { useEffect, useRef, useState } from 'react';
import useLatestRef from './useLatestRef';

interface IUseInterval {
  start: (ms: number) => void;
  stop: () => void;
}

function useInterval(callback: () => void): IUseInterval {
  const [delay, setDelay] = useState(0);
  const savedCallback = useLatestRef(callback);
  const timer = useRef<number>();

  const start = (ms: number): void => {
    setDelay(ms);
  };

  const stop = (): void => {
    setDelay(0);
    clearInterval(timer?.current);
  };

  useEffect(() => {
    if (delay > 0) {
      timer.current = window.setInterval(() => {
        savedCallback?.current();
      }, delay);

      return () => stop();
    }
    return () => stop();
  }, [delay]);

  return { start, stop };
}

export default useInterval;
