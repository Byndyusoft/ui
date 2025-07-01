export const requestBody = {
    firstParameter: 'firstParameterValue'
}

export const successResponse = {
    success: true
}

export const baseUrl = 'https://test-url.com';
export const getPath = '/get';
export const getPathWithQueryParams = '/get/with-query';
export const getPathWithError = '/get/with-error';
export const getPathWithTimeout = '/get/with-timeout';
export const getTokenPath = '/get/token';
export const getDataWithAuthorizationPath = '/get/with-authorization';
export const postPath = '/post';
export const putPath = '/put';
export const patchPath = '/patch';
export const deletePath = '/delete';

export const baseHeaders = { Authorization: 'Bearer token' };

export const optionalHeaders = { Header: 'Header value'};

export const queryParams = { testParam: 'тестовоеЗначение' };

export const errorDetails = { detail_1: 'description_1', detail_2: 'description_2' };
