import { create } from 'zustand';
import { ApiData, ApiType } from '../model/type.model';
import { ApiModel } from '../model/api-model';
import { v4 as uuid } from 'uuid';

type Store = {
    isSidebarOpen: boolean;
    api: ApiData;
    apiCollections: ApiData[];
    addApiCollection: (apiData: string) => void;
    updateApiCollection: (apiData: string) => void;
    addApi: (collectionId: string, id: string, apiData: string) => void;
    toggleSidebar: () => void;
    getApiDetails: (id: string) => void;
    deleteApiDetails: (id: string) => void;
    updateApiDetails: (id: string, collectionId: string, apiData: string) => void;
};

const useStore = create<Store>((set) => ({
    isSidebarOpen: false,
    apiCollections: localStorage.getItem('apiCollections')
        ? JSON.parse(localStorage.getItem('apiCollections')!)
        : [],
    api: localStorage.getItem('apiDocDetails')
        ? JSON.parse(localStorage.getItem('apiDocDetails')!)
        : ({} as ApiData),
    addApi: (collectionId: string, id: string, apiData: string) => {
        let apiCollections: ApiData[] = localStorage.getItem('apiCollections')
            ? JSON.parse(localStorage.getItem('apiCollections')!)
            : [];
        let updatedCollection = apiCollections?.map((collection) => {
            if (collection?.id === collectionId) {
                let data = {
                    ...JSON.parse(apiData),
                    id,
                };
                collection?.routes?.push(data);
                return collection;
            } else {
                return collection;
            }
        });

        localStorage.setItem('apiCollections', JSON.stringify(updatedCollection));

        set((state) => ({
            ...state,
            apiCollections: updatedCollection,
        }));
    },
    addApiCollection: (apiData: string) => {
        let apiCollections: ApiData[] = localStorage.getItem('apiCollections')
            ? JSON.parse(localStorage.getItem('apiCollections')!)
            : [];
        let api: ApiData = JSON.parse(apiData);
        api.id = uuid();
        apiCollections.push(JSON.parse(apiData));
        localStorage.setItem('apiCollections', JSON.stringify(apiCollections));
        set((state) => ({
            ...state,
            apiCollections,
        }));
    },
    updateApiCollection: (apiData: string) => {
        let apiCollections: ApiData[] = localStorage.getItem('apiCollections')
            ? JSON.parse(localStorage.getItem('apiCollections')!)
            : [];
        let apiCollection: ApiData = JSON.parse(apiData);
        apiCollections = apiCollections.map((item) => {
            if (item?.id === apiCollection?.id) {
                return { ...item, ...apiCollection };
            } else {
                return item;
            }
        });
        localStorage.setItem('apiCollections', JSON.stringify(apiCollections));
        set((state) => ({
            ...state,
            apiCollections,
        }));
    },
    getApiDetails: (id: string) => {
        let apiCollections: ApiData[] = localStorage.getItem('apiCollections')
            ? JSON.parse(localStorage.getItem('apiCollections')!)
            : [];
        let apiDetails: ApiData =
            apiCollections?.find((item) => item?.id === id) ?? ({} as ApiData);
        localStorage.setItem('apiDocDetails', JSON.stringify(apiDetails));
        set((state) => ({
            ...state,
            api: apiCollections?.find((item) => item?.id === id),
        }));
    },
    updateApiDetails: (id: string, collectionId: string, apiData: string) => {
        let apiCollections: ApiData[] = localStorage.getItem('apiCollections')
            ? JSON.parse(localStorage.getItem('apiCollections')!)
            : [];
        let updatedApiCollections: ApiData[] = apiCollections?.map((item) => {
            if (item?.id === collectionId) {
                let items = item?.routes?.map((route) => {
                    if (route?.id === id) {
                        return JSON.parse(apiData);
                    } else {
                        return route;
                    }
                });
                return { ...item, routes: items };
            } else {
                return item;
            }
        }) as ApiData[];
        localStorage.setItem('apiCollections', JSON.stringify(updatedApiCollections));
        set((state) => ({
            ...state,
            apiCollections: updatedApiCollections,
        }));
    },
    deleteApiDetails: (id: string) => {
        let apiCollections: ApiData[] = localStorage.getItem('apiCollections')
            ? JSON.parse(localStorage.getItem('apiCollections')!)
            : [];
        if (apiCollections.find((item) => item.id === id)) {
            apiCollections = apiCollections.filter((item) => item.id !== id);
            localStorage.setItem('apiCollections', JSON.stringify(apiCollections));
            set((state) => ({
                ...state,
                apiCollections,
            }));
        }
    },
    toggleSidebar: () => {
        set((state) => ({
            ...state,
            isSidebarOpen: !state.isSidebarOpen,
        }));
    },
}));

export default useStore;
