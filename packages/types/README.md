# `types`

> TODO: description

## Usage

### Import library

```
const types = require('@byndyusoft-ui/types');

or

import types from '@byndyusoft-ui/types';
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

### IsTuple

```typescript
import { IsTuple } from '@byndyusoft-ui/types';

type Test1 = IsTuple<string>; // false
type Test2 = IsTuple<Array<string>>; // false
type Test3 = IsTuple<[string]>; // true
type Test4 = IsTuple<[string, number]>; // true
```

### Callback

Import:

```typescript
import { Callback } from '@byndyusoft-ui/types';
```

Usage examples:

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
type TArgs = [number, number, number];
type TReturn = boolean;

const callback: Callback<TArgs, TReturn> = (num1, num2, num3) => {
    return 0 < num1 + num2 + num3;
};

callback(1, 2, 3); // return boolean
```

```typescript
type TArgs = [Array<number>, { value: number }];
type TReturn = Array<string>;

const callback: Callback<TArgs, TReturn> = (numbers, obj) => {
    return numbers.map(num => String(num * obj.value));
};

callback([1, 2, 3, 4], 100); // return Array<string>
```

```typescript
type TArgs = [Array<number>, Array<string>];
type TReturn = string;

const callback: Callback<TArgs, TReturn> = (numbers, strings) => {
    const result = 'Any string';

    // ...some operations

    return result;
};

callback(['a', 'b'], [1, 2, 3, 4]); // return string
```

Requires between 1 and 2 type arguments:

```typescript
// Bad:
const callback: Callback<number, number, number> = (a, b, c) => {};
```

```typescript
// Right:
const callback: Callback<[number, number, number]> = (a, b, c) => {};
```
