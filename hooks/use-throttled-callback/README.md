# `@byndyusoft-ui/use-throttled-callback`
---
> A React hook that throttles the execution of a function to ensure it is called at most once every specified delay.

### Installation

```
npm i @byndyusoft-ui/use-throttled-callback
```

### Usage

#### useThrottledCallback
```jsx
import React, { useState } from 'react';
import useThrottledCallback from '@byndyusoft-ui/use-throttled-callback';

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

### Options  `useThrottledCallback`

The useThrottledCallback accept an optional third parameter, which is an options object. The options object can have the following properties:
- `leading`: Specifies whether the function should be called on the leading edge of the timeout. Default is `true`.
- `trailing`: Specifies whether the function should be called on the trailing edge of the timeout. Default is `true`.

```jsx
const throttleCallback = useThrottledCallback(() => {}, 1500, { leading: false });

const throttleCallback = useThrottledCallback(() => {}, 1500, { trailing: false });

// Callback will not be called!
const throttleCallback = useThrottledCallback(() => {}, 1500, { leading: false, trailing: false });
```

>If both `leading` and `trailing` are set to `false`, the function will not be called at all. This configuration effectively disables the throttling mechanism, as the function will never be executed.
