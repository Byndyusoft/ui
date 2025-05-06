# `@byndyusoft-ui/http-request`

> Http request service
### Installation

```bash
npm i @byndyusoft-ui/http-request
```

## Usage

### To start using this service you need to create a new class instance of HttpRequest.
By default this service is using 'fetch' for sending requests.

```ts
    const httpRequestService = new HttpRequest();

    httpRequestService.get("http://localhost:3000/api/");
```

### You can define own HttpRestController and pass it like on example below.
❗GET and POST methods must be described, others (PATCH/PUT/DELETE) are optional. 

```ts
    const restController = new HttpRestController({
        get: () => {},
        post: () => {},
        /// ...
    })
    
    const httpRequestService = new HttpRequest({
        restController
    });

    httpRequestService.get("http://localhost:3000/api/");

```