import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import CapitalLetterWord from '../../utils/CapitalLetterWord';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiType } from '../../model/type.model';

export const ApiMethod = (method: string, name: string) => {
    switch (method) {
        case 'GET':
            return <span className="text-green-500">{name}</span>;
        case 'POST':
            return <span className="text-blue-500">{name}</span>;
        case 'PUT':
            return <span className="text-purple-500">{name}</span>;
        case 'DELETE':
            return <span className="text-red-500">{name}</span>;
    }
};

export default function ApiFolder({ apiName, api }: { apiName: string; api: ApiType[] }) {
    let [isOpen, setIsOpen] = useState<boolean>(false);
    let navigate = useNavigate();
    let params = useParams();
    console.log(api);

    useEffect(() => {
        if (api.find((item) => item.id === params?.apiId)) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, []);

    return (
        <div className="w-auto py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="dark:text-white flex items-center"
            >
                {isOpen ? (
                    <FaFolderOpen className="dark:text-white mr-2 text-gray-500" />
                ) : (
                    <FaFolder className="dark:text-white mr-2 text-gray-500" />
                )}
                {CapitalLetterWord(apiName)}
            </button>
            {api.map((apiItem) => (
                <button
                    key={apiItem.name + apiItem.url}
                    className={
                        (isOpen
                            ? 'visible opacity-100 h-full w-full py-2'
                            : ' invisible h-0 w-full opacity-0') +
                        ' ml-2  pl-4 dark:text-white block text-left truncate border-l dark:border-gray-500  hover:border-dark-primary-50 dark:hover:border-white hover:dark:text-gray-400 normal-transition rounded-r-md ' +
                        (params?.apiId === apiItem?.id
                            ? ' dark:border-white border-dark-primary-50 bg-white shadow-md dark:bg-dark-primary-50 text-base'
                            : 'text-sm border-gray-300')
                    }
                    onClick={() => {
                        console.log('api open');
                        navigate(`/collections/${params?.id}/api/${params?.apiId}`);
                    }}
                >
                    {ApiMethod(apiItem.method, apiItem.name)}
                </button>
            ))}
        </div>
    );
}
