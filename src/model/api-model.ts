import { ApiData } from './type.model';

export const ApiModel: ApiData = {
    baseUrl: '',
    routes: [
        {
            name: '',
            description: '',
            url: {
                path: '',
            },
            method: '',
        },
    ],
};

export const DemoStructure: ApiData = {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    routes: [
        {
            name: 'Get Comments of Posts',
            description: '',
            url: {
                path: '/posts/:id/comments',
                variables: {
                    isRequired: true,
                    params: {
                        id: '1',
                    },
                },
            },
            method: 'GET',
            body: {
                isRequired: false,
                params: {},
            },
            headers: {
                isRequired: false,
                params: {},
            },
            query: {
                isRequired: true,
                params: {
                    _start: '0',
                    _limit: '10',
                },
            },
        },
    ],
};
