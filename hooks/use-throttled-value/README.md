# `@byndyusoft-ui/use-throttle`
---
> A React hook that throttles the execution of a function to ensure it is called at most once every specified delay.

### Installation

```
npm i @byndyusoft-ui/use-throttle
```
### Usage


#### useThrottledValue
```jsx
import { useMemo, useState } from "react";
import { useThrottledValue } from '@byndyusoft-ui/use-throttle'

const performHeavyCalculation = (value) => {
  console.log("Heavy calculation for value:", value);
  return value;
};

export default function App() {
  const [value, setValue] = useState(0);
  const throttledValue = useThrottledValue(value, 5000);

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

