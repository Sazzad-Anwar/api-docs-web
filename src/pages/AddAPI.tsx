import { useEffect, useState } from 'react';
import useThemeToggler from '../hooks/useThemeToggle/Index';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';
import { Suspense, lazy } from 'react';
import Loader from '../components/Loader/Index';
import { SingleApi } from '../model/api-model';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiType } from '../model/type.model';
import { BiArrowBack } from 'react-icons/bi';
import { HiOutlineCode } from 'react-icons/hi';
import { VscChromeClose } from 'react-icons/vsc';
import useStore from '../store/store';
import { v4 as uuid } from 'uuid';
const Modal = lazy(() => import('../components/Modal/Modal'));
const Editor = lazy(() => import('../components/Editor/Index'));

export default function AddAPI() {
    let { theme, toggleTheme } = useThemeToggler();
    let navigate = useNavigate();
    let [apiDetailsDoc, setApiDetailsDoc] = useState<string>('');
    let [api, setApi] = useState<ApiType>({} as ApiType);
    let [isEdited, setIsEdited] = useState<boolean>(false);
    let [openModal, setOpenModal] = useState<boolean>(false);
    let store = useStore();
    let params = useParams();

    useEffect(() => {
        if (store?.api?.routes?.find((item) => item?.id === params?.apiId)) {
            setApi(store?.api?.routes?.find((item) => item?.id === params?.apiId)!);
        } else {
            // navigate('/collections');
        }
    }, []);

    let handleSetData = (value: string): void => {
        setApiDetailsDoc(JSON.stringify(value));
        setIsEdited(true);
    };

    return (
        <div className="h-screen w-full dark:bg-dark-primary-50 relative">
            <button onClick={toggleTheme} className="absolute right-5 top-5 dark:text-white z-10">
                {theme === 'dark' ? <FaMoon /> : <BsFillSunFill />}
            </button>
            <div className="container mx-auto pt-10">
                <div className="flex items-center justify-between mb-5 w-full">
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                navigate(-1);
                            }}
                            className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded pr-2  font-medium active:scale-95  mr-2"
                        >
                            <BiArrowBack className="text-dark dark:text-white" size={25} />
                        </button>
                        <h1 className="text-xl dark:text-gray-200 font-medium mb-0">Add Api</h1>
                    </div>
                    <button
                        className="font-base flex items-center cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 justify-self-end rounded border border-gray-200 px-2 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white ml-2"
                        onClick={() => setOpenModal(true)}
                    >
                        <HiOutlineCode size={20} className="mr-1" />
                        <span className="hidden lg:block">Show structure</span>
                    </button>
                </div>
                <div className="my-3">
                    <h1 className="dark:text-white text-lg mb-1">
                        Collection Name:
                        <span className="text-base font-normal p-1 px-2 ml-5 dark:bg-gray-700 text-[#fa6d1b] bg-gray-200 rounded">
                            {store?.api?.collectionName}
                        </span>
                    </h1>
                    <h1 className="dark:text-white text-lg">
                        Base URL:
                        <span className="text-base font-normal p-1 px-2 ml-5 dark:bg-gray-700 text-[#fa6d1b] bg-gray-200 rounded">
                            {store?.api?.baseUrl}
                        </span>
                    </h1>
                </div>
                <Suspense fallback={<Loader />}>
                    <Editor
                        jsonData={SingleApi}
                        readOnly={false}
                        height="70vh"
                        setData={handleSetData}
                    />
                </Suspense>

                <button
                    disabled={!isEdited}
                    onClick={() => {
                        if (apiDetailsDoc !== '') {
                            let id = uuid();
                            store.addApi(params?.id!, id, JSON.parse(apiDetailsDoc));
                            navigate(`/collections/${params?.id}/api/${id}`);
                        }
                    }}
                    className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-14 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white mt-3 disabled:dark:border-blue-900 disabled:bg-blue-600 disabled:bg-opacity-20 disabled:text-gray-400 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    Save
                </button>
            </div>
            <Suspense fallback={<Loader />}>
                <Modal isOpen={openModal} onClose={() => setOpenModal(!openModal)}>
                    <div className="dark:bg-dark-primary-50 p-5 w-[60vw] bg-white">
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
                                    jsonData={SingleApi}
                                    readOnly={true}
                                    height="60vh"
                                    width="58vw"
                                />
                            </Suspense>
                        </div>
                    </div>
                </Modal>
            </Suspense>
        </div>
    );
}
