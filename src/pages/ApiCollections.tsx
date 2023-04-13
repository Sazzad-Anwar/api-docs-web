import useStore from '../store/store';
import { SiPostman } from 'react-icons/si';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';
import useThemeToggler from '../hooks/useThemeToggle/Index';
import { useNavigate } from 'react-router-dom';
import { MdMoreVert } from 'react-icons/md';
import { Suspense, lazy, useState } from 'react';
import Loader from '../components/Loader/Index';
import { VscChromeClose } from 'react-icons/vsc';
import { ApiData } from '../model/type.model';
const Modal = lazy(() => import('../components/Modal/Modal'));

export default function ApiCollections() {
    const store = useStore();
    let { theme, toggleTheme } = useThemeToggler();
    let [openModal, setOpenModal] = useState<boolean>(false);
    let [selectedCollection, setSelectedCollection] = useState<ApiData>({} as ApiData);
    const navigate = useNavigate();

    return (
        <>
            <div className="w-full h-screen dark:bg-dark-primary-50 bg-white px-5 relative">
                <div className="absolute right-10 top-5 z-10">
                    <button onClick={toggleTheme} className=" dark:text-white">
                        {theme === 'dark' ? <FaMoon /> : <BsFillSunFill />}
                    </button>
                </div>
                <div className="container mx-auto pt-10">
                    <button
                        onClick={() => navigate(`/collections/create`)}
                        className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white mb-5"
                    >
                        Create Collection
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                        {store?.apiCollections?.map((collection) => (
                            <div
                                key={collection?.id}
                                onClick={() => {
                                    navigate(
                                        `/collections/${collection?.id}/api/${collection?.routes[0]?.id}`,
                                    );
                                    // console.log(collection);
                                    // store.getApiDetails(collection?.id!);
                                }}
                                className="p-5 rounded-md border border-gray-500 group shadow-none hover:shadow-md normal-transition hover:border-[#c16630] flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <SiPostman
                                        size={30}
                                        className="dark:text-white text-black group-hover:text-[#c16630] mr-3"
                                    />
                                    <span className="dark:text-white truncate w-[80%] text-lg">
                                        {collection?.collectionName}
                                    </span>
                                </div>
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setOpenModal(true);
                                        setSelectedCollection(collection);
                                    }}
                                    className="p-2 hover:bg-gray-200 hover:dark:bg-gray-800 normal-transition rounded-full dark:text-white active:dark:bg-transparent"
                                >
                                    <MdMoreVert />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                {!store?.apiCollections?.length && (
                    <div className="h-[50vh] flex justify-center items-center dark:text-gray-300">
                        <h1 className="font-medium text-xl">No collection found</h1>
                    </div>
                )}
            </div>
            <Suspense fallback={<Loader />}>
                <Modal isOpen={openModal} onClose={() => setOpenModal(!openModal)}>
                    <div className="dark:bg-dark-primary-50 p-5 w-[30vw]">
                        <div className="flex items-start justify-between">
                            <h1 className="text-lg font-medium dark:text-white">Actions</h1>
                            <button
                                onClick={() => setOpenModal(!openModal)}
                                className="p-2 rounded-full dark:hover:bg-dark-primary-40 dark:text-white"
                            >
                                <VscChromeClose />
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-center">
                            <button
                                onClick={() =>
                                    navigate(`/collections/${selectedCollection?.id}/update`)
                                }
                                className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 active:bg-blue-500 dark:border-blue-600 text-white ml-2"
                            >
                                Edit
                            </button>
                            <button
                                className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 active:bg-blue-500 dark:border-blue-600 text-white ml-2"
                                onClick={() => {
                                    store.deleteApiDetails(selectedCollection?.id!);
                                    setOpenModal(false);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            </Suspense>
        </>
    );
}
