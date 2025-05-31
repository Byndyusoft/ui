import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AxiosHttpClient from '../services/axiosClient';

interface IResponseData {
    success: boolean;
}

describe('services/AxiosHttpClient', () => {
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    })

    afterEach(() => {
        mockAxios.restore();
    });

    test('should send POST request with correct headers, body, and URL', async () => {
        const baseUrl = 'https://some-url.ru';
        const path = '/test-path';
        const body = { key: 'value' };
        const headers = { 'Authorization': 'Bearer token' };
        const responseData = { success: true };

        mockAxios
            .onPost(path)
            .reply(200, responseData);

        const httpClientInstance = new AxiosHttpClient({ baseURL: baseUrl, headers: { test: 'value' } });

        const response = await httpClientInstance
            .post<IResponseData>()
            .url(path)
            .headers(headers)
            .body(body)
            .send();

        expect(mockAxios.history.post.length).toBe(1);

        const lastRequest = mockAxios.history.post[0];

        console.log(lastRequest.headers);

        expect(lastRequest.baseURL).toBe(baseUrl);
        expect(lastRequest.url).toBe(path);
        expect(lastRequest.data).toEqual(JSON.stringify(body));
        expect(lastRequest.headers).toMatchObject(Object.assign(headers, { test: 'value' }));
        expect(response).toEqual({ success: true });
    });
});
