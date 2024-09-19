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

### Callback

```typescript
import { Callback } from '@byndyusoft-ui/types';

const callback: Callback<number[] | string[], string> = (numbers, strings) => {
    const result = 'Any string';

    // ...some operations

    return result;
};

callback(['a', 'b'], [1, 2, 3, 4]);
```
