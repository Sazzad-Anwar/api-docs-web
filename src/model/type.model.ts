export type ApiType = {
    id?: string;
    name: string;
    description: string;
    url: {
        path: string;
        variables?: {
            isRequired: boolean;
            params?: object | null;
        };
    };
    method: string;
    body?: {
        isRequired: boolean;
        params?: object | null;
    };
    headers?: {
        isRequired: boolean;
        params?: object | null;
    };
    query?: {
        isRequired: boolean;
        params?: object | null;
    };
};

export type ApiData = {
    baseUrl: string;
    routes: ApiType[];
};

export type SideBarPropsType = {
    src: ApiData;
    title: string;
    className?: string;
};

export type StatusType = {
    status: number;
    statusText: string;
    time: string;
};
