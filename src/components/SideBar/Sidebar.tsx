import { useEffect, useState } from 'react';
import ApiFolder from '../ApiFolder/Index';
import { ApiData, SideBarPropsType } from '../../model/type.model';
import { useNavigate, useParams } from 'react-router-dom';
import { RiFileEditLine } from 'react-icons/ri';
import useDeviceWidth from '../../hooks/useDeviceWidth/useDeviceWidth';
import useStore from '../../store/store';
import { VscChromeClose } from 'react-icons/vsc';
import { HiMenuAlt1 } from 'react-icons/hi';
import { BiArrowBack } from 'react-icons/bi';

export default function SideBar({ apiId, collectionId, className }: SideBarPropsType) {
    const [apiNames, setApiNames] = useState<string[]>([]);
    const navigate = useNavigate();
    const { isMobileWidth } = useDeviceWidth();
    const [sidebarClass, setSidebarClass] = useState<string>('');
    const { id } = useParams();
    const store = useStore();
    let collection: ApiData =
        store?.apiCollections?.find((collection) => collection?.id === collectionId) ??
        ({} as ApiData);
    let routes = collection?.routes ?? [];

    useEffect(() => {
        collection?.routes?.map((route) => {
            if (route?.isGrouped && route?.groupName) {
                if (!apiNames?.find((name) => name === route?.groupName)) {
                    apiNames.push(route?.groupName);
                }
            }
        });
    }, []);

    useEffect(() => {
        if (isMobileWidth && store.isSidebarOpen) {
            setSidebarClass(
                'h-screen overflow-auto border-r bg-primary-400 dark:bg-dark-primary-40 border-gray-200 dark:border-gray-600 absolute top-0 bottom-0 left-0 z-10 w-80',
            );
        } else if (isMobileWidth && !store.isSidebarOpen) {
            setSidebarClass('hidden');
        } else if (!isMobileWidth) {
            setSidebarClass(
                'h-screen overflow-auto relative border-r bg-primary-400 dark:bg-dark-primary-40 border-gray-200 dark:border-gray-600 w-3/12 2xl:w-2/12',
            );
        }
    }, [isMobileWidth, store.isSidebarOpen]);

    return (
        <div className={sidebarClass}>
            <div className="flex justify-between items-center max-w-xl dark:bg-dark-primary-50">
                <div className="px-7 py-3 truncate dark:text-white sticky top-0  flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <button onClick={() => navigate(`/collections`)} className="mr-5">
                            <BiArrowBack />
                        </button>
                        <span className="truncate lg:text-sm xl:text-base">
                            {collection?.collectionName}
                        </span>
                    </div>
                    <button
                        onClick={() => navigate(`/collections/${id}/api/create`)}
                        className="justify-self-end cursor-pointer text-sm font-ubuntu normal-transition py-1 items-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white mx-2"
                    >
                        Add
                    </button>
                    {isMobileWidth && (
                        <button
                            onClick={() => store.toggleSidebar()}
                            className="justify-self-end cursor-pointer text-sm font-ubuntu normal-transition p-2 items-end rounded border border-gray-200 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white mr-1"
                        >
                            {store.isSidebarOpen ? <VscChromeClose /> : <HiMenuAlt1 />}
                        </button>
                    )}
                </div>
            </div>
            <div className="px-7 py-2 flex items-center">
                {/* <button className="font-base cursor-pointer flex items-center lg:font-lg font-ubuntu normal-transition py-1 justify-self-end rounded border border-gray-200 px-3 lg:w-full xl:w-auto bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white">
                    <RxShare1 className="mr-1" /> Share
                </button> */}
            </div>
            <div className="px-7 pb-5">
                {apiNames.map((apiName, i) => (
                    <ApiFolder
                        key={apiName}
                        apiName={apiName}
                        api={routes.filter((api) => api?.groupName === apiName)!}
                    />
                ))}
            </div>
        </div>
    );
}
