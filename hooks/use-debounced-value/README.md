# `@byndyusoft-ui/use-debounced-value`
---

> A React hook that uses to delay update state updates until a specified time period has passed without any further changes

### Installation

```
npm i @byndyusoft-ui/use-debounced-value
# or
yarn add @byndyusoft-ui/use-debounced-value
```

### Usage

```tsx
() => {
    const initalValue = '';
    const delay = 1000;

    const [debouncedValue, setDebouncedValue] = useDebouncedValue(initalValue, delay);
    
    return (
        <div>
            <input onChange={e => setDebouncedValue(e.target.value)} />
            <span>Debounced result: {debouncedValue}</span>
        </div>
    );
}
```

### License

Apache-2.0

### Authors

Anastasia Vasenina, Viktor Smorodin
