# `@byndyusoft-ui/http`

> Http service
### Installation

```bash
npm i @byndyusoft-ui/http
```

## Usage

### To start using this service you need to create a new class instance of http client.
There are two classes ready to be used as http clients: **HttpClientAxios** and **HttpClientFetch**.

### Example of usage with HttpClientAxios

```ts
import HttpClientAxios from '@byndyusoft-ui/http';

interface IRequestBody {
    name: string;
}

interface IResponse {
    message: string;
}

const httpClient = new HttpClientAxios({ baseUr: 'https://base-url.com' });

const postData = async (name: string): Promise<IResponse> => await httpClient
    .post<IResponse>()
    .url('/post-some-data')
    .headers({ Authorization: 'Bearer token'})
    .body<IRequestBody>({ name })
    .send();
```

### Example of usage with HttpClientFetch

```ts
    import HttpClientFetch from '@byndyusoft-ui/http';
    
    interface IResponse {
        message: string;
    }
    
    const httpClient = new HttpClientFetch({ baseUr: 'https://base-url.com' });
    
    const getData = async (month: string): Promise<IResponse> => await httpClient
        .get<IResponse>()
        .url('/get-some-data')
        .headers({ Authorization: 'Bearer token'})
        .params({ month })
        .send();
```
