import { createUrl, createUrlsByPaths, generatePath, isPathExtendsParams } from './pathsBuilder.utilities';

describe('services/paths-builder', () => {
    describe('isPathExtendsParams', () => {
        test('should return correct result', () => {
            expect(isPathExtendsParams('/users')).toBeFalsy();
            expect(isPathExtendsParams('/users/comments/')).toBeFalsy();
            expect(isPathExtendsParams('/users/comments?/')).toBeFalsy();
            expect(isPathExtendsParams('/users/comments?')).toBeFalsy();
            expect(isPathExtendsParams('/users/comments/?queryParam1=1&queryParam2=2')).toBeFalsy();
            expect(isPathExtendsParams('tasks/:taskId')).toBeTruthy();
            expect(isPathExtendsParams('tasks/:taskId?')).toBeTruthy();
            expect(isPathExtendsParams('/tasks/:taskId/edit?')).toBeTruthy();
            expect(isPathExtendsParams('/tasks/:taskId/comments/:commentId/?queryParam1=1&queryParam2=2')).toBeTruthy();
        });
    });

    describe('generatePath', () => {
        test('should return correct result', () => {
            // without params
            expect(generatePath('/tasks/')).toBe('/tasks/');
            expect(generatePath('/tasks')).toBe('/tasks');
            expect(generatePath('tasks/')).toBe('tasks/');
            expect(generatePath('tasks')).toBe('tasks');
            expect(generatePath('/tasks/?queryParam1=1&queryParam2=2')).toBe('/tasks/?queryParam1=1&queryParam2=2');
            expect(generatePath('tasks/?queryParam1=1&queryParam2=2')).toBe('tasks/?queryParam1=1&queryParam2=2');

            // with params
            expect(generatePath('/tasks/:taskId/', { taskId: 1 })).toBe('/tasks/1/');
            expect(generatePath('tasks/:taskId/', { taskId: 1 })).toBe('tasks/1/');
            expect(generatePath('/tasks/:taskId', { taskId: 1 })).toBe('/tasks/1');
            expect(generatePath('tasks/:taskId', { taskId: 1 })).toBe('tasks/1');
            expect(generatePath('/tasks/:taskId/comments/:commentId', { taskId: 1, commentId: 5 })).toBe(
                '/tasks/1/comments/5'
            );
            expect(
                generatePath('/tasks/:taskId/comments/:commentId/?queryParam1=1&queryParam2=2', {
                    taskId: 1,
                    commentId: 5
                })
            ).toBe('/tasks/1/comments/5/?queryParam1=1&queryParam2=2');

            // with empty required params
            expect(generatePath('/tasks/:taskId/', { taskId: '' })).toBe('/tasks/null/');
            expect(generatePath('/tasks/:taskId/', { taskId: null })).toBe('/tasks/null/');

            // without required params
            // @ts-ignore
            expect(() => generatePath('/tasks/:taskId')).toThrow('Missing ":taskId" param');
            // @ts-ignore
            expect(() => generatePath('/tasks/:taskId/comments/:commentId')).toThrow('Missing ":taskId" param');

            // with optional params
            // @ts-ignore
            expect(generatePath('/tasks/:taskId?')).toBe('/tasks');
            // @ts-ignore
            expect(generatePath('/tasks/:taskId?/')).toBe('/tasks/');
            expect(generatePath('/tasks/:taskId?/', { taskId: '' })).toBe('/tasks/');
            expect(generatePath('/tasks/:taskId?/', { taskId: null })).toBe('/tasks/');
            // @ts-ignore
            expect(generatePath('/tasks/:taskId?/edit/?queryParam1=1&queryParam2=2')).toBe(
                '/tasks/edit/?queryParam1=1&queryParam2=2'
            );

            // with optional segments
            expect(generatePath('/tasks/edit?/')).toBe('/tasks/edit/');
            expect(generatePath('/tasks/:taskId/edit?', { taskId: 1 })).toBe('/tasks/1/edit');
            expect(generatePath('/tasks/:taskId/edit?/?queryParam1=1&queryParam2=2', { taskId: 1 })).toBe(
                '/tasks/1/edit/?queryParam1=1&queryParam2=2'
            );
        });
    });

    describe('createUrl', () => {
        test('should return correct result', () => {
            expect(createUrl('/users')).toBe('/users');
            expect(createUrl('/users/:userId', { userId: 1 })).toBe('/users/1');
            expect(createUrl('/users', { baseUrl: '/v1' })).toBe('/v1/users');
            expect(createUrl('/users/:userId/', { userId: 1 }, { baseUrl: 'http://test.com' })).toBe(
                'http://test.com/users/1/'
            );
        });
    });

    describe('createUrlsByPaths', () => {
        test('should return correct result', () => {
            const paths = {
                users: '/users',
                userComment: '/users/:userId/comments/:commentId/'
            } as const;

            const result = createUrlsByPaths(paths);

            expect(result.users()).toBe('/users');
            expect(result.userComment({ userId: 1, commentId: 2 })).toBe('/users/1/comments/2/');

            const resultWithBaseUrl = createUrlsByPaths(paths, { baseUrl: 'http://test.com' });

            // with baseUrl
            expect(resultWithBaseUrl.users()).toBe('http://test.com/users');
            expect(resultWithBaseUrl.userComment({ userId: 1, commentId: 2 })).toBe(
                'http://test.com/users/1/comments/2/'
            );

            // with replaced baseUrl
            expect(resultWithBaseUrl.users({ baseUrl: 'http://another-site.com' })).toBe(
                'http://another-site.com/users'
            );
            expect(
                resultWithBaseUrl.userComment({ userId: 1, commentId: 2 }, { baseUrl: 'http://another-site.com' })
            ).toBe('http://another-site.com/users/1/comments/2/');
        });
    });
});
