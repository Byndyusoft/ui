# `types`

> TODO: description

## Usage

```
const types = require('types');

// TODO: DEMONSTRATE API
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

### VoidFunc

```typescript
import { VoidFunc } from '@byndyusoft-ui/types';

const callback: VoidFunc<number[] | string[]> = (numbers, strings) => {
    // ...some operations
};

callback(['a', 'b'], [1, 2, 3, 4]);
```

