import { useState } from 'react';
import { ApiType } from '../../components/SideBar/Index';

export default function useSelectedApi() {
    let [apiDetails, setApiDetails] = useState<ApiType>();

    let selectApiHandler = (api: ApiType) => {
        setApiDetails(api);
    };

    return { apiDetails, selectApiHandler };
}
