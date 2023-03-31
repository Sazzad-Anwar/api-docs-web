import { useEffect, useState } from 'react';
import ApiFolder from '../ApiFolder/Index';
import { SideBarPropsType } from '../../model/type.model';
import { useNavigate } from 'react-router-dom';
import { GrClose } from 'react-icons/gr';
import { RiFileEditLine } from 'react-icons/ri';
import { RxShare1 } from 'react-icons/rx';
import useDeviceWidth from '../../hooks/useDeviceWidth/useDeviceWidth';
import useStore from '../../store/store';
import { VscChromeClose } from 'react-icons/vsc';
import { HiMenuAlt1 } from 'react-icons/hi';

export default function SideBar({ src, title, className }: SideBarPropsType) {
    const [apiNames, setApiNames] = useState<string[]>([]);
    const navigate = useNavigate();
    const { isMobileWidth } = useDeviceWidth();
    const [sidebarClass, setSidebarClass] = useState<string>('');
    const store = useStore();

    useEffect(() => {
        for (let api in src.routes) {
            let name = src.routes[api].url.path.split('/')[1];

            if (!apiNames.includes(name)) {
                setApiNames([...apiNames, name].sort());
            }
        }
    }, [apiNames, src]);

    useEffect(() => {
        if (isMobileWidth && store.isSidebarOpen) {
            setSidebarClass(
                'h-screen overflow-auto border-r bg-primary-400 dark:bg-dark-primary-40 border-gray-200 dark:border-gray-600 absolute top-0 bottom-0 left-0 z-10 w-80',
            );
        } else if (isMobileWidth && !store.isSidebarOpen) {
            setSidebarClass('hidden');
        } else if (!isMobileWidth) {
            setSidebarClass(
                'h-screen overflow-auto relative border-r bg-primary-400 dark:bg-dark-primary-40 border-gray-200 dark:border-gray-600 w-2/12',
            );
        }
    }, [isMobileWidth, store.isSidebarOpen]);

    return (
        <div className={sidebarClass}>
            <div className="flex justify-between items-center max-w-xl dark:bg-dark-primary-50">
                <h1 className="px-7 py-3 truncate dark:text-white text-xl sticky top-0  flex items-center justify-between">
                    {title}
                </h1>
                {isMobileWidth && (
                    <button
                        onClick={() => store.toggleSidebar()}
                        className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-1 mr-2 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white"
                    >
                        {store.isSidebarOpen ? <VscChromeClose /> : <HiMenuAlt1 />}
                    </button>
                )}
            </div>
            <div className="px-7 py-2 flex items-center">
                <button
                    onClick={() => navigate('/api/create')}
                    className="font-base cursor-pointer flex items-center lg:font-lg font-ubuntu normal-transition py-1 justify-self-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white mr-2"
                >
                    <RiFileEditLine className="mr-1" /> Edit
                </button>
                {/* <button className="font-base cursor-pointer flex items-center lg:font-lg font-ubuntu normal-transition py-1 justify-self-end rounded border border-gray-200 px-3 lg:w-full xl:w-auto bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white">
                    <RxShare1 className="mr-1" /> Share
                </button> */}
            </div>
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
