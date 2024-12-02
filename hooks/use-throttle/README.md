# `@byndyusoft-ui/use-throttle`
---
> A React hook that throttles the execution of a function to ensure it is called at most once every specified delay.

### Installation

```
npm i @byndyusoft-ui/use-throttle
```
### Usage
#### useThrottledCallback
```jsx
import React, { useState } from 'react';
import { useThrottledCallback } from '@byndyusoft-ui/use-throttle';

const App = () => {
    const [count, setCount] = useState(0);

    const throttledHandleClick = useThrottledCallback(() => {
        setCount(prevCount => prevCount + 1);
    }, 1500);

    return (
        <div>
            <h1>Throttle Click Demo</h1>
            <p>Count: {count}</p>
            <button onClick={throttledHandleClick}>Click me</button>
        </div>
    );
};

export default App;
```

#### useThrottledValue

```jsx
import { useMemo, useState } from "react";
import { useThrottledValue } from "./useThrottledValue";

const performHeavyCalculation = (value) => {
  console.log("Heavy calculation for value:", value);
  return value;
};

export default function App() {
  const [value, setValue] = useState(0);
  const throttledValue = useThrottledValue({ value, throttleMs: 5000 });

  const memoizedValue = useMemo(() => {
    return performHeavyCalculation(throttledValue);
  }, [throttledValue]);

  return (
    <div>
      <button onClick={() => setValue(value + 1)}>Increment value</button>
      <p>Calculates a new value every fifth second.</p>
      <p>Value: {value}</p>
      <p>Last caculated result: {memoizedValue}</p>
    </div>
  );
}
```

### Options
The useThrottledCallback and useThrottledValue hooks accept an optional third parameter, which is an options object. The options object can have the following properties:
- `leading`: A boolean that specifies whether the function should be called on the leading edge of the timeout. Default is `true`.
- `trailing`: A boolean that specifies whether the function should be called on the trailing edge of the timeout. Default is `true`.

```jsx
useThrottledCallback(() => {}, 1500, { leading: false });
useThrottledValue(() => {}, 1500, { leading: false });

useThrottledCallback(() => {}, 1500, { trailing: false });
useThrottledValue(value, 1500, { trailing: false })

// callback will not be called
useThrottledCallback(() => {}, 1500, { leading: false, trailing: false });
useThrottledValue(value, 1500, { leading: false, trailing: false });
```


>If both `leading` and `trailing` are set to `false`, the function will not be called at all. This configuration effectively disables the throttling mechanism, as the function will never be executed.
