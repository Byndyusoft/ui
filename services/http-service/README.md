# `@byndyusoft-ui/http-service`

> Http service
### Installation

```bash
npm i @byndyusoft-ui/http-service
```

## Usage

### To start using this service you need to create a new class instance of HttpService and provide restController option.
There are two classes ready to be used as restControllers: **HttpRestControllerFetch** and **HttpRestControllerAxios**. For fetch and axios.
```ts
    const restController = new HttpRestControllerFetch();
    const httpService = new HttpService({
        restController
    });

    httpService.get("http://localhost:3000/api/");
```

### Example of usage with HttpRestControllerFetch

```ts
    const restController = new HttpRestControllerFetch();
    const HttpService = new HttpService({
        restController
    });

    const handleGetProducts = async (): Promise<void> => {
        const products = await httpService
            .get('http://localhost:3322/products')
            .then(async r => (await r.json()) as IProduct[]);

        setProducts(products);
    };
```

### Example of usage with HttpRestControllerAxios

```ts
    const restController = new HttpRestControllerAxios();
    const HttpService = new HttpService({
        restController
    });

    const handleGetProducts = async (): Promise<void> => {
        const products = await httpService.get<IProduct[]>('http://localhost:3322/products').then(r => r.data);

        setProducts(products);
    };
```

### You can define own HttpRestController and pass it like this 

```ts
    // myOwnHttpRestController.ts
    import { HttpRestController } from '@byndyusoft-ui/http-service';

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

    // httpService.ts
    import HttpRestControllerCustom from './myOwnHttpRestController.ts'

    const restController = new HttpRestControllerCustom();
    const httpService = new HttpService({
        restController
    });

    httpService.get("http://localhost:3000/api/");
```

