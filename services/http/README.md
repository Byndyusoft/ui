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
import { http } from 'msw';

interface IRequestBody {
    name: string;
}

interface IResponse {
    message: string;
}

const httpClient = new HttpClientAxios({ baseUrl: 'https://base-url.com' });

const postData = async (name: string): Promise<IResponse> => await httpClient
    .post<IResponse>()
    .url('/post-some-data')
    .headers({Authorization: 'Bearer token'})
    .body<IRequestBody>({name})
    .send();
```

### Example of usage with HttpClientFetch

```ts
    import HttpClientFetch from '@byndyusoft-ui/http';
    
    interface IResponse {
        message: string;
    }
    
    const httpClient = new HttpClientFetch({ baseUrl: 'https://base-url.com' });
    
    const getData = async (month: string): Promise<IResponse> => await httpClient
        .get<IResponse>()
        .url('/get-some-data')
        .headers({ Authorization: 'Bearer token'})
        .params({ month })
        .send();
```

### You can add request, response and error interceptors

```ts
    const httpClient = new HttpClientFetch({ baseUr: 'https://base-url.com' });

    httpClient.setRequestInterceptor(requestConfig => {
        // interceptor logic
    
        return modifiedRequestConfig;
    });

    httpClient.setResponseInterceptor(response => {
        // interceptor logic
    
        return modifiedResponse;
    });
```
#### Example of token refreshing and request repeating when error 401 is received

```ts
    httpClient.setErrorInterceptor(async error =>  {
        if (error.response?.status === HttpStatusCode.UNAUTHORIZED) {
            const { data: { token } } = await httpClient
                .get<{ token: string }>()
                .url('/get-token-path')
                .send();
    
            httpClient.setHeader('Authorization', `Bearer ${token}`);
    
            return httpClient.requestClient({
                method: error.config?.method as HttpMethod,
                url: error.config?.url,
                headers: { ...error.config?.headers, Authorization: `Bearer ${token}` },
                params: error.config?.params,
                body: error.config?.data as Object
            });
        }
    
        throw error;
    });
```
