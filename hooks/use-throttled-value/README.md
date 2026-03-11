# `@byndyusoft-ui/use-throttle`
---
> A React hook that throttles value updates to a specified delay.

### Installation

```
npm i @byndyusoft-ui/use-throttled-value
```
### Usage

#### useThrottledValue
```jsx
import React, { useState, useMemo } from "react";
import { useThrottledValue } from '@byndyusoft-ui/use-throttled-value';

const initValue = 0;

export default function App() {
  const [throttledValue, setThrottledValue] = useThrottledValue(initValue, 1500);

  const performHeavyCalculation = () => {
    setThrottledValue(Math.floor(Math.random() * 10000));
  };
  
  return (
    <div>
      <button onClick={performHeavyCalculation}>Calculate</button>
      <p>Throttled value: {throttledValue}</p>
    </div>
  );
}
```

### Options for useThrottledValue

The `useThrottledValue` hook accepts an optional third parameter, which is an options object. The options object can have the following properties:

- `leading`: Specifies whether the function should be called on the leading edge of the timeout. Default is `true`.
- `trailing`: Specifies whether the function should be called on the trailing edge of the timeout. Default is `true`.

```jsx
const [throttledValue, setThrottledValue] = useThrottledValue(0, 1500, { leading: false });

const [throttledValue, setThrottledValue] = useThrottledValue(0, 1500, { trailing: false });

// Callback will not be called!
const [throttledValue, setThrottledValue] = useThrottledValue(0, 1500, { leading: false, trailing: false });
```

>If both `leading` and `trailing` are set to `false`, the function will not be called at all. This configuration effectively disables the throttling mechanism, as the function will never be executed.
