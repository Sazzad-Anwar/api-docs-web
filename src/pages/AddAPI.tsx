import { useEffect, useState } from 'react';
import useThemeToggler from '../hooks/useThemeToggle/Index';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';
import { Suspense, lazy } from 'react';
import Loader from '../components/Loader/Index';
import { ApiModel, DemoStructure } from '../model/api-model';
import { useNavigate } from 'react-router-dom';
import { ApiData } from '../model/type.model';
import { v4 as uuid } from 'uuid';
import { BiArrowBack } from 'react-icons/bi';
import { HiOutlineCode } from 'react-icons/hi';
import { VscChromeClose } from 'react-icons/vsc';
import useStore from '../store/store';
import Modal from '../components/Modal/Modal';
const Editor = lazy(() => import('../components/Editor/Index'));

export default function AddAPI() {
    let { theme, toggleTheme } = useThemeToggler();
    let navigate = useNavigate();
    let [apiDetailsDoc, setApiDetailsDoc] = useState<string>('');
    let [api, setApi] = useState<ApiData>({} as ApiData);
    let [isEdited, setIsEdited] = useState<boolean>(false);
    let [openModal, setOpenModal] = useState<boolean>(false);
    let store = useStore();

    let handleSetData = (value: string): void => {
        let jsonValue = JSON.parse(value) as ApiData;
        let idGeneratedRoutes = jsonValue?.routes?.map((route) => ({
            ...route,
            id: uuid(),
        }));
        let updatedJSON: ApiData = {
            baseUrl: jsonValue?.baseUrl,
            routes: idGeneratedRoutes,
        };
        setApiDetailsDoc(JSON.stringify(updatedJSON));
        setIsEdited(true);
    };

    useEffect(() => {
        if (Object.values(store.api).length) {
            setApi(store.api);
        } else {
            setApi(ApiModel);
        }
    }, []);

    return (
        <div className="h-screen w-full dark:bg-dark-primary-50 relative">
            <button onClick={toggleTheme} className="absolute right-5 top-5 dark:text-white z-10">
                {theme === 'dark' ? <FaMoon /> : <BsFillSunFill />}
            </button>
            <div className="container mx-auto pt-10">
                <div className="flex items-center mb-5">
                    <button
                        onClick={() => {
                            navigate(-1);
                        }}
                        className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white mr-2"
                    >
                        <BiArrowBack />
                    </button>
                    <h1 className="text-xl dark:text-gray-200 font-medium mb-0">
                        Create you api documentation here:
                    </h1>
                    <button
                        className="font-base flex items-center cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 justify-self-end rounded border border-gray-200 px-2 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white ml-2"
                        onClick={() => setOpenModal(true)}
                    >
                        <HiOutlineCode size={20} className="mr-1" /> Show structure
                    </button>
                </div>
                <Suspense fallback={<Loader />}>
                    <Editor jsonData={api} readOnly={false} height="80vh" setData={handleSetData} />
                </Suspense>

                <button
                    disabled={!isEdited}
                    onClick={() => {
                        if (apiDetailsDoc !== '') {
                            let fistDocId: string = (JSON.parse(apiDetailsDoc) as ApiData).routes[0]
                                ?.id!;
                            store.addApi(apiDetailsDoc);
                            navigate(`/api/${fistDocId}/details`);
                        }
                    }}
                    className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-14 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white mt-3 disabled:dark:border-blue-900 disabled:bg-blue-600 disabled:bg-opacity-20 disabled:text-gray-400 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    Save
                </button>
            </div>

            <Modal isOpen={openModal} onClose={() => setOpenModal(!openModal)}>
                <div className="dark:bg-dark-primary-50 p-5 w-[60vw]">
                    <div className="flex items-start justify-between">
                        <h1 className="text-lg font-medium dark:text-white">
                            Sample structure of data to make an API docs
                        </h1>
                        <button
                            onClick={() => setOpenModal(!openModal)}
                            className="p-2 rounded-full dark:hover:bg-dark-primary-40 dark:text-white"
                        >
                            <VscChromeClose />
                        </button>
                    </div>

                    <div className="mt-4">
                        <Suspense fallback={<Loader />}>
                            <Editor
                                jsonData={DemoStructure}
                                readOnly={true}
                                height="60vh"
                                width="58vw"
                            />
                        </Suspense>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
