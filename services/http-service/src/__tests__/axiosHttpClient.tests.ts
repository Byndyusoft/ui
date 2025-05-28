import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AxiosHttpClient } from '../axiosHttpClient';

describe('services/AxiosHttpClient', () => {
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    })

    afterEach(() => {
        mockAxios.restore();
    });

    it('should send POST request with correct headers, body, and URL', async () => {
        const baseUrl = 'https://some-url.ru';
        const path = '/test-path';
        const data = { key: 'value' };
        const headers = { 'Authorization': 'Bearer token' };

        mockAxios.onPost(baseUrl + path, data, { headers }).reply(200, { success: true });

        const httpClientInstance = new AxiosHttpClient({ baseURL: baseUrl });

        const response = await httpClientInstance
            .post()
            .url(path)
            .headers(headers)
            .body(data)
            .send();

        expect(mockAxios.history.post.length).toBe(1);

        const lastRequest = mockAxios.history.post[0];

        expect(lastRequest.url).toBe(baseUrl + path);
        expect(lastRequest.data).toEqual(JSON.stringify(data));
        expect(lastRequest.headers).toMatchObject(headers);
        expect(response).toEqual({ success: true });
    });
});
