import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import CapitalLetterWord from '../../utils/CapitalLetterWord';
import { useState } from 'react';
import { ApiType } from '../SideBar/Index';
import { useNavigate } from 'react-router-dom';

export const ApiMethod = (method: string, name: string) => {
    switch (method) {
        case 'GET':
            return <span className="text-sm text-green-500">{name}</span>;
        case 'POST':
            return <span className="text-sm text-blue-500">{name}</span>;
        case 'PUT':
            return <span className="text-sm text-purple-500">{name}</span>;
        case 'DELETE':
            return <span className="text-sm text-red-500">{name}</span>;
    }
};

export default function ApiFolder({ apiName, api }: { apiName: string; api: ApiType[] }) {
    let [isOpen, setIsOpen] = useState<boolean>(false);
    let navigate = useNavigate();

    return (
        <div className="w-auto py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="dark:text-white flex items-center"
            >
                {isOpen ? (
                    <FaFolderOpen className="dark:text-white mr-2" />
                ) : (
                    <FaFolder className="dark:text-white mr-2" />
                )}
                {CapitalLetterWord(apiName)}
            </button>
            {api.map((apiItem) => (
                <button
                    key={apiItem.name + apiItem.url}
                    className={
                        (isOpen
                            ? 'visible opacity-100 h-full w-full py-1'
                            : ' invisible h-0 w-full opacity-0') +
                        ' ml-2  pl-4 dark:text-white block text-left truncate border-l border-gray-500 hover:border-dark-primary-50 dark:hover:border-white hover:dark:text-gray-400 normal-transition'
                    }
                    onClick={() => navigate(`/api/${apiItem.id}/details`, { state: apiItem })}
                >
                    {ApiMethod(apiItem.method, apiItem.name)}
                </button>
            ))}
        </div>
    );
}
