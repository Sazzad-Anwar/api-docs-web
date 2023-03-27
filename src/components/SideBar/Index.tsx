import { useEffect, useState } from 'react';
import ApiFolder from '../ApiFolder/Index';

export type ApiType = {
    id: string;
    name: string;
    description: string;
    url: {
        path: string;
        variables: {
            isRequired: boolean;
            params?: object | null;
        };
    };
    method: string;
    body: {
        isRequired: boolean;
        params?: object | null;
    };
    headers: {
        isRequired: boolean;
        params?: object | null;
    };
    query: {
        isRequired: boolean;
        params?: object | null;
    };
    metadata?: '';
};

type ApiData = {
    baseUrl: string;
    routes: ApiType[];
};

type SideBarPropsType = {
    src: ApiData;
    title: string;
    className?: string;
};

export default function SideBar({ src, title, className }: SideBarPropsType) {
    const [apiNames, setApiNames] = useState<string[]>([]);

    useEffect(() => {
        for (let api in src.routes) {
            let name = src.routes[api].url.path.split('/')[1];

            if (!apiNames.includes(name)) {
                setApiNames([...apiNames, name].sort());
            }
        }
    }, [apiNames, src]);

    return (
        <div className="h-screen overflow-auto relative w-80 border-r bg-primary-400 dark:bg-dark-primary-40 border-gray-200 dark:border-gray-600">
            <h1 className="px-7 py-3 truncate dark:text-white text-xl sticky top-0 max-w-xl dark:bg-dark-primary-50">
                {title}
            </h1>
            <div className="px-7 pb-5">
                {apiNames.map((apiName, i) => (
                    <ApiFolder
                        key={apiName}
                        apiName={apiName}
                        api={src.routes.filter((api) => api.url.path.split('/')[1] === apiName)!}
                    />
                ))}
            </div>
        </div>
    );
}
