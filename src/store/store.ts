import { create } from 'zustand';
import { ApiData } from '../model/type.model';

type Store = {
    isSidebarOpen: boolean;
    api: ApiData;
    addApi: (apiData: string) => void;
    toggleSidebar: () => void;
};

const useStore = create<Store>((set) => ({
    isSidebarOpen: false,
    api: localStorage.getItem('apiDocDetails')
        ? JSON.parse(localStorage.getItem('apiDocDetails')!)
        : ({} as ApiData),

    addApi: (apiData: string) => {
        localStorage.setItem('apiDocDetails', apiData);

        set((state) => ({
            ...state,
            api: JSON.parse(apiData),
        }));
    },
    toggleSidebar: () => {
        set((state) => ({
            ...state,
            isSidebarOpen: !state.isSidebarOpen,
        }));
    },
}));

export default useStore;
