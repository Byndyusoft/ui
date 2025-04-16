# `@byndyusoft-ui/types`

## Installation

```sh
npm i @byndyusoft-ui/types
# or
yarn add @byndyusoft-ui/types
```

### Import library

```
import types from '@byndyusoft-ui/types';
```

### Callback

Import:

```typescript
import { Callback } from '@byndyusoft-ui/types';
```

Usage examples:

```typescript
const callback: Callback = () => {};

callback(); // return void
```

```typescript
const callback: Callback<never, number> = () => {
    return 123;
};

callback(); // return number
```

```typescript
type TArg = string;

const callback: Callback<TArg> = str => {};

callback('some text'); // return void
```

```typescript
type TArg = number;
type TReturn = string;

const callback: Callback<TArg, TReturn> = num => num.toString();

callback(100); // return string
```

```typescript
type TArgs = [number];
type TReturn = string;

const callback: Callback<TArgs, TReturn> = num => num.toString();

callback(100); // return string
```

```typescript
type TArgs = [
    number,
    number,
    number? // optional argument
];
type TReturn = boolean;

const callback: Callback<TArgs, TReturn> = (num1, num2, num3 = -5) => {
    return 0 < num1 + num2 + num3;
};

callback(1, 2); // return false
callback(1, 2, 3); // return true
```

```typescript
type TArgs = [Array<number>, { value: number }];
type TReturn = Array<string>;

const callback: Callback<TArgs, TReturn> = (numbers, obj) => {
    return numbers.map(num => String(num * obj.value));
};

callback([1, 2, 3, 4], { value: 100 }); // return Array<string>
```

```typescript
type TArgs = [Array<number>, Array<string>];
type TReturn = string;

const callback: Callback<TArgs, TReturn> = (numbers, strings) => {
    const result = 'Any string';

    // ...some operations

    return result;
};

callback([1, 2, 3, 4], ['a', 'b']); // return string
```

#### Required arguments count

Requires between 0 and 2 type arguments:

##### Bad:

```typescript
const callback: Callback<number, number, number> = (a, b, c) => {};
```

##### Right:

0 arguments:

```typescript
const callback: Callback = () => {};
```

1 argument:

```typescript
const callback: Callback<number> = (a) => {};
```

```typescript
const callback: Callback<[number, number, number]> = (a, b, c) => {};
```

2 arguments:

```typescript
const callback: Callback<never, string> = () => {
    return 'Text';
};
```

```typescript
const callback: Callback<number, string> = (a) => {
    return 'Text';
};
```

```typescript
const callback: Callback<[number, number, number], string> = (a, b, c) => {
    return 'Text';
};
```

### EmptyObject

```typescript
const str: {} = 'str'; // ok
const num: {} = 123; // ok
const bool: {} = true; // ok
```

```typescript
import { EmptyObject } from '@byndyusoft-ui/types';

const str: EmptyObject = 'str'; // Type 'string' is not assignable to type 'EmptyObject'.
const num: EmptyObject = 123; // Type 'number' is not assignable to type 'EmptyObject'.
const bool: EmptyObject = true; // Type 'boolean' is not assignable to type 'EmptyObject'.
```

### IsTuple

```typescript
import { IsTuple } from '@byndyusoft-ui/types';

type Test1 = IsTuple<string>; // false
type Test2 = IsTuple<Array<string>>; // false
type Test3 = IsTuple<[string]>; // true
type Test4 = IsTuple<[string, number]>; // true
```

### PlainObject

```typescript
const date: object = new Date(); // ok
const rgx: object = new RegExp('[a-z]'); // ok
```

```typescript
import { PlainObject } from '@byndyusoft-ui/types';

const date: PlainObject = new Date(); // Type 'Date' is not assignable to type 'PlainObject<unknown>'.
const rgx: PlainObject = new RegExp('[a-z]'); // Type 'RegExp' is not assignable to type 'PlainObject<unknown>'.

const a: PlainObject = { a: 'b', c: 'd' }; // ok
```

### ValueOf

```typescript
import { ValueOf } from '@byndyusoft-ui/types';

enum Fruits {
    APPLE = 'apple',
    ORANGE = 'orange'
}

const fruitsDictionary = {
    [Fruits.APPLE]: 'Яблоко' as string,
    [Fruits.ORANGE]: 'Апельсин' as string
};

const TFruitsDictionaryValues = ValueOf<typeof fruitsDictionary>;
// TFruitsDictionaryValues = 'Яблоко' | 'Апельсин'
```

### TimeoutId

```typescript
import { TimeoutId } from '@byndyusoft-ui/types';

const timeoutIdRef = useRef<TimeoutId | null>(null);

timeoutIdRef.current = setTimeout(() => {}, 1000);

clearTimeout(timeoutIdRef.current);
timeoutIdRef.current = null;
```

### IntervalId

```typescript
import { IntervalId } from '@byndyusoft-ui/types';

const intervalIdRef = useRef<IntervalId | null>(null);

intervalIdRef.current = setInterval(() => {}, 1000);

clearInterval(intervalIdRef.current);
intervalIdRef.current = null;
```
