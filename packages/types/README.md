# `types`

> TODO: description

## Usage

```
const types = require('types');

// TODO: DEMONSTRATE API
```

### TValueOf

```typescript
import { TValueOf } from '@byndyusoft-ui/types';

enum EFruits {
    APPLE = 'apple',
    ORANGE = 'orange'
}

const fruitsDictionary = {
    [EFruits.APPLE]: 'Яблоко' as string,
    [EFruits.ORANGE]: 'Апельсин' as string
};

const TFruitsDictionaryValues = TValueOf<typeof fruitsDictionary>;
// TFruitsDictionaryValues = 'Яблоко' | 'Апельсин'
```
