import useLatestRef from '@byndyusoft-ui/use-latest-ref';

export default function usePrevious<T>(value: T): T | undefined {
    const ref = useLatestRef(value);

    return ref.current;
}
