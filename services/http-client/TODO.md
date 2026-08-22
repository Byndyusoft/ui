# TODO — @byndyusoft-ui/http-client

Связанные архитектурные решения зафиксированы в [DECISIONS.md](./DECISIONS.md).

## P0

### P0-1 — Релизная гигиена: README + changeset + версия

`homepage` в package.json указывает на несуществующий `#readme`, `.changeset/` пуст, версия `0.0.1` → `0.1.0` при первом publish. Нужны README с примерами (настройка Fetch/XHR, приоритеты конфигурации client → builder → adapter, `withCredentials`, ограничения CORS, таблица ошибок, hooks) и changeset перед паблишем. В README отдельно зафиксировать: маппинг `withCredentials` → fetch `credentials` (`true` → `include`, `false` → `same-origin`, `undefined` → `credentials` адаптера ?? `same-origin`) согласно D-001; контракт `body()` (допустимые типы, автосериализация объектов в JSON с авто-`Content-Type`, `body(undefined)` выбрасывает `RequestBuilderError`, `body(null)` отправляет JSON `null`) согласно D-006; ограничение `redirect: 'manual'` (opaque-redirect приходит как `HttpResponseError` со статусом `0`, продолжить редирект вручную нельзя).

## P1

### P1-1 — Типизировать тело HTTP-ошибки

`HttpResponseError<T>` уже параметризован, но адаптеры создают его с `unknown`, а guard не позволяет вызывающему коду указать ожидаемый тип. Вариант с доверенным generic-guard, например `isHttpResponseError<ValidationError>(error)`, зафиксирован в D-004 со статусом «не принято». После выбора контракта нужны явные сценарии для `400` и `422` и type-тесты.

### P1-2 — Вывод типа данных ответа из `responseType`

`responseType('blob').execute()` возвращает `unknown`, а рассинхрон `responseType('blob')` + `execute<string>()` не ловится компилятором. Вариант, при котором JSON сохраняет явный `execute<T>()`, а `text`, `blob`, `arrayBuffer`, `formData` и `stream` получают тип из `responseType`, зафиксирован в D-003 со статусом «не принято». После выбора контракта понадобятся type-тесты. Сделать до README, чтобы документировать финальный API.

## P2

### P2-1 — Модернизация package.json

Сборка только CJS: нет `exports`-map (dual ESM/CJS для Vite-потребителей), `sideEffects: false`, `engines` (Node 20). Без ESM-входа недоступен tree-shaking.

### P2-2 — Добавить progress API для XHR

Выделить публичный контракт для `onDownloadProgress` и `onUploadProgress`. Нужно документировать, что upload-progress является преимуществом XHR и не имеет стандартного аналога в Fetch.

### P2-3 — Добавить `validateStatus`

Сейчас любой статус вне 2xx → `HttpResponseError`. Нужна опция `validateStatus?: (status) => boolean` (client/request), чтобы 404/304 и т.п. можно было считать успехом.

### P2-4 — Спроектировать opt-in retry

Согласно D-005, повторы будут реализованы в отдельном opt-in классе для оркестрации запросов, без встраивания retry-логики в `HttpClient`, адаптеры или hooks. Нужно спроектировать лимит попыток, exponential backoff, поддержку `Retry-After`, отмену через `AbortSignal`, перечень временных сетевых сбоев и статусов (`408`, `429`, часть `5xx`), а также безопасное поведение для мутаций.

### P2-5 — Зафиксировать edge-cases XHR stream

Поведение abort/timeout после resolve stream и 4xx при `responseType: 'stream'` должно быть явным контрактом (reject promise vs `stream.error`) с тестами. Смежное: расходящаяся семантика timeout для STREAM — fetch-таймер живёт до получения заголовков, `xhr.timeout` покрывает всю загрузку; задокументировать или унифицировать. Также задокументировать, что XHR-stream не настоящий стрим: ответ целиком накапливается в `responseText`, что ограничивает размер стриминговых ответов по памяти.

### P2-6 — Добавить браузерные интеграционные тесты

Проверить в настоящих браузерах credentialed CORS, preflight, cookies с `SameSite`/`Secure`, redirects и `keepalive`. Тесты jsdom и mock-адаптеров не воспроизводят эти особенности платформы. Актуально после появления реальных пользователей credentials-API.

## P3

### P3-1 — Развить hooks до композиционного pipeline

Сейчас на каждую фазу можно назначить лишь один хук, а следующий вызов заменяет предыдущий. При совместном использовании auth, tracing и логирования потребуется композиция хуков с предсказуемым порядком и правилами восстановления.

### P3-2 — Convenience-методы builder

Опциональный сахар: `json()`, `acceptJson()`, `multipart()` поверх headers.

### P3-3 — Чистка конфигурации

`.npmignore` избыточен при `files: ["dist"]` — удалить. Поправить команду запуска тестов пакета в корневом AGENTS.md (`vitest run --root ../../ --project <name>` не работает; рабочий вариант — `npm test -w @byndyusoft-ui/http-client`).

## Рекомендуемый порядок

1. P0: README + changeset (после P1 «вывод типа данных ответа», чтобы документировать финальный API)
2. P1: typed errors
3. P2: package.json модернизация вместе с релизной подготовкой
4. P2: retry / progress / validateStatus по продуктовым нуждам
5. P2–P3: DX и полировка фоном

## Закрыто

1. Модель ошибок + guards (`HttpResponseError`, `ParseError`, `cause`/`config`)
2. `TimeoutError.timeout`, `ParseError.responseType` / `raw`
3. Body: FormData / URLSearchParams / Blob / ArrayBufferView (`prepareRequestBody`)
4. Default `params`, number/boolean params, null-skip
5. Options/config validation, `RequestPreparationError`
6. formData / stream response types
7. `FetchAdapter`: `ParseError`, если streaming body отсутствует (`response.body === null`)
8. `HttpResponseError` передаёт `config` в базовый `HttpClientError`
9. Default `FetchAdapter`, `withCredentials` (client / builder / оба адаптера)
10. Adapter options (`FetchAdapterOptions`, `XhrAdapterOptions`)
11. Удалены устаревшие закомментированные методы из `HttpRequestBuilder`
12. Publish hygiene: `files: ["dist"]`, `.npmignore`
13. Default `headers` клонируются в конструкторе `HttpClient`.
14. Языковое соглашение: комментарии и JSDoc исходников — английский; пользовательские документы пакета — русский (D-002).
15. Валидация `FetchAdapter`: исключён `mode: 'navigate'`; `cache: 'only-if-cached'` требует `mode: 'same-origin'`.
16. Parity Fetch/XHR: `Content-Length: 0`, error body при `blob`/`formData` и fail-fast для недоступного `Response.formData`.
17. Пустые `params` нормализуются в `undefined` вместо `{}`.
18. Утилиты покрыты изолированными тестами и английскими JSDoc; зафиксирована мутация headers в `prepareRequestBody`.
19. Согласно D-006, `body(undefined)` выбрасывает `RequestBuilderError` с кодом `INVALID_BODY`, а `body(null)` отправляет JSON `null`.
