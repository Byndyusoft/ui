# TODO — @byndyusoft-ui/http-client

Связанные архитектурные решения зафиксированы в [DECISIONS.md](./DECISIONS.md).

## P2

### P2-4 — Спроектировать opt-in retry

Согласно D-005, повторы будут реализованы в отдельном opt-in классе для оркестрации запросов, без встраивания retry-логики в `HttpClient`, адаптеры или hooks. Нужно спроектировать лимит попыток, exponential backoff, поддержку `Retry-After`, отмену через `AbortSignal`, перечень временных сетевых сбоев и статусов (`408`, `429`, часть `5xx`), а также безопасное поведение для мутаций.

### P2-6 — Добавить браузерные интеграционные тесты

Проверить в настоящих браузерах credentialed CORS, preflight, cookies с `SameSite`/`Secure`, redirects и `keepalive`. Тесты jsdom и mock-адаптеров не воспроизводят эти особенности платформы. Актуально после появления реальных пользователей credentials-API.

## P3

### P3-1 — Развить hooks до композиционного pipeline

Сейчас на каждую фазу можно назначить лишь один хук, а следующий вызов заменяет предыдущий. При совместном использовании auth, tracing и логирования потребуется композиция хуков с предсказуемым порядком и правилами восстановления.

## Рекомендуемый порядок

1. P2: retry по продуктовым нуждам
2. P2–P3: DX и полировка фоном

## Отложено

### P2-5 — Зафиксировать edge-cases XHR stream

Сценарий отложен как крайне редкий. Текущее ограничение явно описано в README: XHR stream формируется из `responseText`, держит весь текст ответа в памяти, а поздние abort, timeout и network errors передаются через ошибку потока после завершения `execute()`.

Вернуться к задаче следует при появлении реального production-сценария XHR stream, требований к большим или бинарным ответам либо необходимости унифицировать поведение Fetch и XHR для timeout, abort и `ReadableStream.cancel()`. Тогда контракт нужно закрепить тестами для поздних ошибок, ответов 4xx, отмены потока и hooks.

## Не планируется

### P3-2 — Convenience-методы builder

Явно не берём в работу как необязательный синтаксический сахар. Для настройки заголовков достаточно `header()` и `headers()`, а решение можно пересмотреть только при появлении подтверждённых повторяющихся сценариев. Причины зафиксированы в D-010.

## Закрыто

1. Модель ошибок + guards (`HttpResponseError`, `ParseError`, `cause`/`config`)
2. `TimeoutError.timeout`, `ParseError.responseType` / `raw`
3. Body: FormData / URLSearchParams / Blob / ArrayBufferView (`prepareRequestBody`)
4. Default `params`, number/boolean params, null-skip
5. Options/config validation, `RequestPreparationError`
6. `stream` response type
7. `FetchAdapter`: `ParseError`, если streaming body отсутствует (`response.body === null`)
8. `HttpResponseError` передаёт `config` в базовый `HttpClientError`
9. Default `FetchAdapter`, `withCredentials` (client / builder / оба адаптера)
10. Adapter options (`FetchAdapterOptions`, `XhrAdapterOptions`)
11. Удалены устаревшие закомментированные методы из `HttpRequestBuilder`
12. Publish hygiene: публикация ограничена `files: ["dist"]`, избыточный `.npmignore` удалён.
13. Default `headers` клонируются в конструкторе `HttpClient`.
14. Языковое соглашение: комментарии и JSDoc исходников — английский; пользовательские документы пакета — русский (D-002).
15. Валидация `FetchAdapter`: исключён `mode: 'navigate'`; `cache: 'only-if-cached'` требует `mode: 'same-origin'`.
16. Parity Fetch/XHR: `Content-Length: 0` и error body при `blob`.
17. Пустые `params` нормализуются в `undefined` вместо `{}`.
18. Утилиты покрыты изолированными тестами и английскими JSDoc; зафиксирована мутация headers в `prepareRequestBody`.
19. Согласно D-006, `body(undefined)` выбрасывает `RequestBuilderError` с кодом `INVALID_BODY`, а `body(null)` отправляет JSON `null`.
20. Согласно D-007, формат ответа выбирается через `asJson<T>()`, `asText()`, `asBlob()`, `asArrayBuffer()` или `asStream()`, а `execute()` не принимает generic.
21. Формат ответа `formData` удалён; отправка `FormData` через `body()` сохранена.
22. Согласно D-009, тело `HttpResponseError` типизируется композицией `isHttpResponseError(error) && isData(error.data)` без усложнения публичного guard; сценарии `400` и `422` покрыты type- и runtime-тестами.
23. Согласно D-011, `XhrAdapter` поддерживает adapter-wide callbacks `onDownloadProgress` и `onUploadProgress`; upload listener подключается только для запросов с телом.
24. Согласно D-012, `HttpClient.withAdapter()` создаёт независимый scoped-клиент со снимком текущих defaults и hooks.
25. P3-3: команда запуска тестов отдельного workspace в корневом `AGENTS.md` исправлена на `npm test -w <package-name>`.
26. Согласно D-013, пакет публикует ESM и CommonJS через `exports`, поддерживает tree-shaking, помечен `sideEffects: false` и требует Node.js 20 или новее.
27. P0-1: minor changeset применён, версия пакета повышена до `0.1.0`, создан русскоязычный `CHANGELOG.md`; публикация в npm не выполнялась.
28. README дополнен полным пользовательским контрактом: окружения, client/builder API, response, URL/params/body, timeout/abort, настройки адаптеров, custom adapter, ошибки, hooks, публичные типы и ограничения.
29. Согласно D-014, `validateStatus` поддерживается на уровне клиента и запроса с приоритетом request → client → стандартный диапазон `200–299`; контракт реализован одинаково в Fetch и XHR.
