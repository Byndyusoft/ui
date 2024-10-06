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
type Test4 = IsTuple<[string, number]> // true
```

### Callback

```typescript
import { Callback } from '@byndyusoft-ui/types';

const callback1: Callback<string> = (str) => {};

const callback2: Callback<number, string> = (num) => num.toString();

const callback3: Callback<[number], string> = (num) => num.toString();

const callback4: Callback<[number, number, number], boolean> = (num1, num2, num3) => {
  return 0 < (num1 + num2 + num3);
};

const callback5: Callback<[Array<number>, { value: number }], Array<string>> = (numbers, obj) => {
  return numbers.map(num => String(num * obj.value));
};

const callback6: Callback<[Array<number>, Array<string>], string> = (numbers, strings) => {
    const result = 'Any string';

    // ...some operations

    return result;
};


callback1('some text'); // return void
callback2(100); // return string
callback3(100); // return string
callback4(1, 2, 3) // return boolean
callback5([1, 2, 3, 4], 100) // return Array<string>
callback6(['a', 'b'], [1, 2, 3, 4]); // return string

// This is not right! Generic type 'Callback' requires between 1 and 2 type arguments
const badCallback: Callback<number, number, number> = (a, b, c) => {}

// It is right! 
const goodCallback: Callback<[number, number, number]> = (a, b, c) => {}
```


