# `@byndyusoft-ui/use-throttle`
---
> A React hook that throttles the execution of a function to ensure it is called at most once every specified delay.

### Installation

```
npm i @byndyusoft-ui/use-throttle
```
### Usage

```jsx
import React, { useState } from 'react';
import useThrottle from '@byndyusoft-ui/use-throttle';

const App = () => {
    const [count, setCount] = useState(0);

    const throttledHandleClick = useThrottle(() => {
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
### Options

The `useThrottle` hook accepts an optional third parameter, which is an options object. The options object can have the following properties:
- `leading`: A boolean that specifies whether the function should be called on the leading edge of the timeout. Default is `true`.
- `trailing`: A boolean that specifies whether the function should be called on the trailing edge of the timeout. Default is `true`.


```jsx
useThrottle(() => {}, 1500, { leading: false });

useThrottle(() => {}, 1500, { trailing: false });

// callback will not be called
useThrottle(() => {}, 1500, { leading: false, trailing: false });
```


>If both `leading` and `trailing` are set to `false`, the function will not be called at all. This configuration effectively disables the throttling mechanism, as the function will never be executed.
