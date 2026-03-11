# `@byndyusoft-ui/use-debounced-callback`
---

> A React hook that uses for delaying the execution of functions updates until a specified time period has passed without any further changes

### Installation

```
npm i @byndyusoft-ui/use-debounced-callback
# or
yarn add @byndyusoft-ui/use-debounced-callback
```

### Usage

```ts
type THookReturn<T> = [T, (arg: T) => void];

const useDebouncedValue = <T>(value: T, delay = 300): THookReturn<T> => {
    const [debouncedValue, setValue] = useState(value);

    const setDebouncedValue = useDebouncedCallback(setValue, delay);

    return [debouncedValue, setDebouncedValue];
};
```

### License

Apache-2.0

### Authors

Anastasia Vasenina, Viktor Smorodin