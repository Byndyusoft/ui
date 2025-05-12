# `@byndyusoft-ui/http-request`

> Http request service
### Installation

```bash
npm i @byndyusoft-ui/http-request
```

## Usage

### To start using this service you need to create a new class instance of HttpRequest and provide restController option.
There are two classes ready to be used as restControllers: **HttpRestControllerFetch** and **HttpRestControllerAxios**. For fetch and axios.
```ts
    const restController = new HttpRestControllerFetch();
    const httpRequest = new HttpRequest({
    restController
});

    httpRequestService.get("http://localhost:3000/api/");
```

### You can define own HttpRestController and pass it like this 

```ts
    // myOwnHttpRestController.ts
    import { HttpRestController } from '@byndyusoft-ui/http-request';

    class HttpRestControllerCustom extends HttpRestController {
        constructor() {
            super();
        }

        get = async <R>(url: string, headers?: Headers): Promise<R> => {
            return fetch(url, { method: 'GET', headers: { ...headers } }) as Promise<R>;
        };

        post = async <R>(url: string, body: object, headers?: Headers): Promise<R> => {
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { ...headers }
            }) as Promise<R>;
        };

        patch = async <R>(url: string, body: object, headers?: Headers): Promise<R> => {
            return fetch(url, {
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: { ...headers }
            }) as Promise<R>;
        };

        put = async <R>(url: string, body: object, headers?: Headers): Promise<R> => {
            return fetch(url, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: { ...headers }
            }) as Promise<R>;
        };

        delete = async <R>(url: string, body: object = {}, headers?: Headers): Promise<R> => {
            return fetch(url, {
                method: 'DELETE',
                body: JSON.stringify(body),
                headers: { ...headers }
            }) as Promise<R>;
        };
    }

    export default HttpRestControllerCustom;
```
```ts

    // httpRequest.ts
    import HttpRestControllerCustom from './myOwnHttpRestController.ts'

    const restController = new HttpRestControllerCustom();
    const httpRequestService = new HttpRequest({
        restController
    });

    httpRequestService.get("http://localhost:3000/api/");
```

