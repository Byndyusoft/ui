# `@byndyusoft-ui/axios`
---
> Axios service

### Installation

```
npm i @byndyusoft-ui/axios
```

### Usage

You can import service

```
import http from '@byndyusoft-ui/axios'
```

Then use this variable as an axios instance. Further documentation you can find on axios website or other sources.

### Cancelable requests

```
import cancelableHttp from '@byndyusoft-ui/axios'

const { cancel } = cancelableHttp.get('/info');
cancel();
```

You also can import axios following way:

```
import { axios } from '@byndyusoft-ui/axios'
```
