import React, { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../assets/APi.json';
import axios from 'axios';
import Loader from '../components/Loader/Index';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';
import useThemeToggler from '../hooks/useThemeToggle/Index';
import { toast } from 'react-toastify';
import { ApiMethod } from '../components/ApiFolder/Index';
import { ApiType, StatusType } from '../model/type.model';
import { AiOutlineReload } from 'react-icons/ai';
import { VscChromeClose } from 'react-icons/vsc';
import { BsClipboard, BsClipboardCheck } from 'react-icons/bs';
import { HiMenuAlt1 } from 'react-icons/hi';
import useStore from '../store/store';
import useDeviceWidth from '../hooks/useDeviceWidth/useDeviceWidth';
const Editor = lazy(() => import('../components/Editor/Index'));

export default function ApiDetails() {
    const { id, apiId } = useParams();
    let { theme, toggleTheme } = useThemeToggler();
    let navigate = useNavigate();
    const store = useStore();
    let apiDetails: ApiType = store?.api?.routes?.find((item: ApiType) => item?.id === apiId)!;
    const [open, setOpen] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [currentOption, setCurrentOption] = useState<string>('');
    const [url, setURL] = useState<string>('');
    const [inputData, setInputData] = useState<any>({});
    const [result, setResult] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [queryObject, setQueryObject] = useState<any>(apiDetails?.query?.params ?? {});
    const [headersObject, setHeadersObject] = useState<any>({});
    const [pathVariablesObject, setPathVariablesObject] = useState<any>(
        apiDetails?.url?.variables?.params ?? {},
    );
    const [paramsData, setParamsData] = useState<any>({});
    const [resultStatus, setResultStatus] = useState<StatusType>({} as StatusType);
    const { isMobileWidth } = useDeviceWidth();

    const formData = new FormData();

    let apiOptions: { name: string; label: string }[] = [
        {
            name: 'headers',
            label: 'Headers',
        },
        {
            name: 'body',
            label: 'Body',
        },
        {
            name: 'query',
            label: 'Query Params',
        },
        {
            name: 'pathVariables',
            label: 'URL Params',
        },
    ];

    // Handling input data from editor
    const handleSetData = (value: any) => {
        if (value) {
            if (currentOption === 'headers') {
                setHeadersObject(JSON.parse(value));
            } else if (currentOption === 'body') {
                setInputData(JSON.parse(value));
            } else if (currentOption === 'query') {
                setQueryObject(JSON.parse(value));
            } else {
                setPathVariablesObject(JSON.parse(value));
            }
        }
    };

    let setAPIresponse = useCallback((data: any) => {
        setResult(data);
    }, []);

    // Setting up params data
    useEffect(() => {
        setQueryObject({});
        setAPIresponse({});
        setResultStatus({} as StatusType);
        if (apiDetails?.headers?.isRequired) {
            setCurrentOption('headers');
            setParamsData(apiDetails?.headers?.params);
        } else if (apiDetails?.body?.isRequired) {
            setCurrentOption('body');
            setParamsData(apiDetails?.body?.params);
        } else if (apiDetails?.query?.isRequired) {
            setCurrentOption('query');
            setParamsData(apiDetails?.query?.params);
        } else if (apiDetails?.url?.variables?.isRequired) {
            setCurrentOption('pathVariables');
            setParamsData(apiDetails?.url?.variables?.params);
        } else {
            setCurrentOption('');
        }

        if (apiDetails === null) {
            navigate('/');
        }
        store.getApiDetails(id!);
    }, [id, apiId]);

    // Setting up currentOption
    useEffect(() => {
        setParamsData(
            currentOption === 'headers'
                ? apiDetails?.headers?.params
                : currentOption === 'body'
                ? apiDetails?.body?.params
                : currentOption === 'query'
                ? apiDetails?.query?.params
                : apiDetails?.url?.variables?.params,
        );
    }, [currentOption, id]);

    // Setting up dynamic URL
    useEffect(() => {
        let data: string = '';
        let url: string = store?.api?.baseUrl + apiDetails?.url?.path;
        if (apiDetails?.query?.isRequired && Object.keys(queryObject).length) {
            Object.keys(queryObject).map((item: any, i) => {
                if (Object.values(queryObject!)[i] !== '') {
                    data += item + '=' + Object.values(queryObject!)[i];
                    if (
                        Object.keys(queryObject!).length > i + 1 &&
                        Object.values(queryObject!)[i + 1] !== ''
                    ) {
                        data += '&';
                    } else {
                        data;
                    }
                }
            });
        }

        if (apiDetails?.url?.variables?.isRequired && Object.keys(pathVariablesObject).length) {
            Object.keys(pathVariablesObject).map((item: string, i) => {
                if (Object.values(pathVariablesObject)[i] !== '') {
                    url = url.replace(
                        `/:${Object.keys(pathVariablesObject)[i]}`,
                        `/${Object.values(pathVariablesObject)[i]}`,
                    );
                }
            });
        }
        setURL(
            url +
                (Object.keys(queryObject).length && !Object.values(queryObject).includes('')
                    ? '?'
                    : '') +
                data,
        );
    }, [apiDetails, url, queryObject, pathVariablesObject]);

    const makeAPIRequest = async (): Promise<void> => {
        setIsLoading(true);

        try {
            if (
                apiDetails?.url?.variables?.isRequired &&
                Object.values(pathVariablesObject).includes('')
            ) {
                debugger;
                toast.warn(`Please set the 'Path Variables'`);
            } else {
                axios.interceptors.request.use(
                    (config) => {
                        const newConfig: any = { ...config };
                        newConfig.metadata = { startTime: new Date() };
                        return newConfig;
                    },
                    (error) => {
                        return Promise.reject(error);
                    },
                );

                axios.interceptors.response.use(
                    (response) => {
                        const newRes: any = {
                            ...response,
                        };
                        newRes.config.metadata.endTime = new Date();
                        newRes.duration =
                            newRes.config.metadata.endTime - newRes.config.metadata.startTime;
                        return newRes;
                    },
                    (error) => {
                        const newError = { ...error };
                        newError.config.metadata.endTime = new Date();
                        newError.duration =
                            newError.config.metadata.endTime - newError.config.metadata.startTime;
                        return Promise.reject(newError);
                    },
                );

                let response: any = await axios({
                    method: apiDetails?.method,
                    url,
                    baseURL: api?.baseUrl,
                    headers: headersObject,
                    data:
                        apiDetails?.body?.isRequired && Object.keys(inputData).length > 0
                            ? inputData
                            : apiDetails?.body?.params,
                    timeout: 4000,
                });

                setAPIresponse(response.data);

                setResultStatus({
                    status: response?.status,
                    statusText: response?.statusText,
                    time: response?.duration + ' ms',
                });
            }

            setIsLoading(false);
        } catch (error: any) {
            console.log(error);
            setAPIresponse(error.response?.data ? error.response.data : error);

            setResultStatus({
                status: error.response?.status,
                statusText: error.response?.statusText,
                time: error.duration + ' ms',
            });

            setIsLoading(false);
        }
    };

    const payloadSize = (data: any): string => {
        // Convert JSON data to string
        // Convert JSON data to string
        const json_string = JSON.stringify(data);

        // Calculate length of string in bytes
        const string_length = new TextEncoder().encode(json_string).length;

        // Convert payload size to KB
        const payload_size_kb = +(string_length / 1024).toFixed(2);
        return payload_size_kb > 1 ? `${payload_size_kb} KB` : `${string_length} B`;
    };

    const description = () => {
        return { __html: apiDetails?.description ? apiDetails?.description : '' };
    };

    return (
        <div className="w-full h-screen dark:bg-dark-primary-50 bg-white px-5 relative">
            <div className="flex justify-between items-center pr-10">
                <div className="flex items-center">
                    {isMobileWidth && (
                        <button
                            onClick={() => store.toggleSidebar()}
                            className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-1 mr-2 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white"
                        >
                            {store.isSidebarOpen ? <VscChromeClose /> : <HiMenuAlt1 />}
                        </button>
                    )}

                    <h1 className="py-3 truncate font-medium dark:text-white text-xl sticky top-0 max-w-xl dark:bg-dark-primary-50 flex items-center justify-between">
                        {apiDetails?.name}
                    </h1>
                </div>
                <button onClick={toggleTheme} className=" dark:text-white">
                    {theme === 'dark' ? <FaMoon /> : <BsFillSunFill />}
                </button>
            </div>
            <div className="flex items-center pr-10">
                <button className="pr-2 py-2 rounded-l-md dark:text-primary-400 ">
                    {ApiMethod(apiDetails?.method!, apiDetails?.method!)}
                </button>
                <div className="flex items-center w-full">
                    <input
                        type="text"
                        className="px-2 py-2 flex-1 bg-transparent bg-primary-400 dark:bg-transparent dark:text-primary-400 w-full "
                        disabled
                        value={url}
                    />
                    <button
                        onClick={async () => {
                            await navigator.clipboard.writeText(url);
                            setIsCopied(true);
                            setTimeout(() => {
                                setIsCopied(false);
                            }, 2000);
                        }}
                        className="font-base flex items-center cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 justify-self-end rounded border border-gray-200 px-2 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white ml-2"
                    >
                        {!isCopied ? (
                            <>
                                <BsClipboard className="mr-2" /> Copy
                            </>
                        ) : (
                            <>
                                <BsClipboardCheck className="mr-2" /> Copied
                            </>
                        )}
                    </button>
                </div>
                <button
                    onClick={() => navigate(`/collections/${id}/api/${apiId}/update`)}
                    className="font-base cursor-pointer lg:text-base font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white ml-2"
                >
                    Edit
                </button>
                <button
                    onClick={() => makeAPIRequest()}
                    className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white ml-2"
                >
                    Send
                </button>
            </div>
            <div className="flex items-center mt-5">
                {apiOptions.map((option) => (
                    <button
                        key={option.name}
                        onClick={() => setCurrentOption(option.name)}
                        className={
                            'dark:text-primary-400 mr-4 flex items-center mx-2 py-1 border-b-2 rounded-bl-sm rounded-br-sm ' +
                            (currentOption === option.name
                                ? ' border-[#c16630] '
                                : ' border-transparent')
                        }
                    >
                        <span className="tex-base mr-1">{option.label}</span>
                        {option.name === 'headers' && apiDetails?.headers?.isRequired && (
                            <span className="w-1 h-1 rounded-full bg-green-500" />
                        )}
                        {option.name === 'body' && apiDetails?.body?.isRequired && (
                            <span className="w-1 h-1 rounded-full bg-green-500" />
                        )}
                        {option.name === 'query' && apiDetails?.query?.isRequired && (
                            <span className="w-1 h-1 rounded-full bg-green-500" />
                        )}
                        {option.name === 'pathVariables' &&
                            apiDetails?.url?.variables?.isRequired && (
                                <span className="w-1 h-1 rounded-full bg-green-500" />
                            )}
                    </button>
                ))}
            </div>
            <div className="mt-3">
                <Suspense fallback={<Loader />}>
                    <Editor
                        jsonData={paramsData}
                        readOnly={false}
                        height="20vh"
                        setData={handleSetData}
                    />
                </Suspense>
            </div>

            <div className="mt-3">
                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <div className="mb-3 flex items-center">
                            <h1 className="font-ubuntu text-base font-medium dark:text-white lg:text-lg">
                                Response
                            </h1>
                            <button
                                onClick={() => setAPIresponse({})}
                                className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-3 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white ml-2"
                            >
                                <AiOutlineReload />
                            </button>
                        </div>
                        {Object.keys(resultStatus).length ? (
                            <div className="flex items-center">
                                <p className="font-ubuntu mr-4 text-base font-semibold dark:font-normal dark:text-white">
                                    Status:
                                    <span
                                        className={
                                            resultStatus.status?.toString().startsWith('2', 0)
                                                ? 'ml-1 font-medium text-green-600 dark:font-normal dark:text-green-400'
                                                : 'ml-1 font-medium text-red-500 dark:font-normal'
                                        }
                                    >
                                        {resultStatus.status} {resultStatus.statusText}
                                    </span>
                                </p>

                                <p className="font-ubuntu mr-4 text-base font-semibold dark:font-normal dark:text-white">
                                    Time:
                                    <span
                                        className={
                                            'ml-1 font-normal text-green-600 dark:font-normal dark:text-green-400'
                                        }
                                    >
                                        {resultStatus.time}
                                    </span>
                                </p>
                                <p className="font-ubuntu mr-4 text-base font-semibold dark:font-normal dark:text-white">
                                    Size:
                                    <span
                                        className={
                                            'ml-1 font-normal text-green-600 dark:font-normal dark:text-green-400'
                                        }
                                    >
                                        {payloadSize(result)}
                                    </span>
                                </p>
                            </div>
                        ) : null}
                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Suspense fallback={<Loader />}>
                            <Editor jsonData={result} readOnly height="50vh" />
                        </Suspense>
                    )}
                </div>
            </div>
        </div>
    );
}
