import { describe, expectTypeOf, it } from 'vitest';
import { HttpClient, HTTP_METHODS, HTTP_STATUS_CODES, IHttpResponse } from '../../src';

interface IItem {
    id: number;
}

describe('HTTP response data types', () => {
    it('returns the selected data type without implicit undefined', async () => {
        const client = new HttpClient({});

        expectTypeOf((await client.get('/items/1').asJson<IItem>().execute()).data).toEqualTypeOf<IItem>();
        expectTypeOf((await client.get('/items/1').asText().execute()).data).toEqualTypeOf<string>();
        expectTypeOf((await client.get('/items/1').asBlob().execute()).data).toEqualTypeOf<Blob>();
        expectTypeOf((await client.get('/items/1').asArrayBuffer().execute()).data).toEqualTypeOf<ArrayBuffer>();
        expectTypeOf((await client.get('/items/1').asStream().execute()).data).toEqualTypeOf<
            ReadableStream<Uint8Array>
        >();
    });

    it('preserves explicit undefined, null, void and unknown', async () => {
        const client = new HttpClient({});
        const optionalResponse = await client
            .get('/items/1')
            .asJson<IItem | undefined>()
            .header('X-Test', '1')
            .execute();

        expectTypeOf(optionalResponse.data).toEqualTypeOf<IItem | undefined>();
        expectTypeOf(
            (await client.get('/items/1').asJson<IItem | null>().execute()).data
        ).toEqualTypeOf<IItem | null>();
        expectTypeOf((await client.delete('/items/1').asJson<void>().execute()).data).toEqualTypeOf<void>();
        expectTypeOf((await client.get('/items/1').asJson<undefined>().execute()).data).toEqualTypeOf<undefined>();
        expectTypeOf((await client.get('/items/1').asJson<unknown>().execute()).data).toEqualTypeOf<unknown>();
        expectTypeOf((await client.get('/items/1').execute()).data).toEqualTypeOf<unknown>();
        expectTypeOf<IHttpResponse['data']>().toEqualTypeOf<unknown>();
    });

    it('requires data when constructing a response', () => {
        const metadata = {
            status: HTTP_STATUS_CODES.OK,
            statusText: 'OK',
            headers: {},
            config: { method: HTTP_METHODS.GET, url: '/items/1' }
        };
        const response: IHttpResponse<IItem> = { ...metadata, data: { id: 1 } };
        const emptyResponse: IHttpResponse<void> = { ...metadata, data: undefined };

        // @ts-expect-error A response must include data even when its type is unknown.
        const missingData: IHttpResponse = metadata;
        // @ts-expect-error Undefined is only valid when it is included in the selected data type.
        const undefinedData: IHttpResponse<IItem> = { ...metadata, data: undefined };

        expectTypeOf(response.data).toEqualTypeOf<IItem>();
        expectTypeOf(emptyResponse).toEqualTypeOf<IHttpResponse<void>>();
        expectTypeOf(missingData).toEqualTypeOf<IHttpResponse>();
        expectTypeOf(undefinedData).toEqualTypeOf<IHttpResponse<IItem>>();
    });
});
