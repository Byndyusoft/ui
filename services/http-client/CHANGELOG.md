# @byndyusoft-ui/http-client

## 0.1.0-alpha.1

### Patch Changes

-   Выпустить `0.1.0-alpha.1`: сделать `data` обязательным свойством `IHttpResponse<T>` с типом `T` без автоматически добавленного `undefined`.

    При создании ответов вручную теперь нужно указывать `data`. Явные `T | undefined`, `null`, `void` и `unknown` сохраняются. Обработка пустых ответов во время выполнения не меняется; generic не проверяет наличие тела или схему данных.

## 0.1.0-alpha.0

### Minor Changes

-   Подготовлен первый публичный альфа-релиз HTTP-клиента:

    -   добавлены неизменяемый request builder и явный выбор формата ответа через `asJson<T>()`, `asText()`, `asBlob()`, `asArrayBuffer()` и `asStream()`;
    -   FetchAdapter установлен по умолчанию, а Fetch- и XHR-адаптеры получили отдельные настройки, credentials/CORS-контракт и типизированные progress callbacks;
    -   добавлены scoped-клиенты через `withAdapter()`, hooks запросов и ответов, отмена и таймауты;
    -   реализована типизированная модель ошибок с guards, конфигурацией запроса, телом HTTP-ошибки и исходной причиной;
    -   расширена поддержка body и query-параметров, включая FormData, URLSearchParams, Blob, ArrayBuffer и числовые/логические параметры;
    -   добавлена dual ESM/CommonJS-сборка с `exports`-map, tree-shaking и требованием Node.js 20 или новее.
