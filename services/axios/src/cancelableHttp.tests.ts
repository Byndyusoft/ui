import { cancelableHttp } from './cancelableHttp';

describe('axios/cancelableHttp', () => {
    test.todo('cancellation works fine', () => {
        const { request, cancel } = cancelableHttp('get', 'https://google.com');
    });
});
