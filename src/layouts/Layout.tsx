import SideBar from '../components/SideBar/Index';
import api from '../assets/APi.json';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useThemeToggler from '../hooks/useThemeToggle/Index';
import { ApiData } from '../model/type.model';
import useDeviceWidth from '../hooks/useDeviceWidth/useDeviceWidth';

export default function Layout() {
    const { theme } = useThemeToggler();
    const { isMobileWidth } = useDeviceWidth();
    const location = useLocation();
    const apiDocs: ApiData = localStorage.getItem('apiDocDetails')
        ? JSON.parse(localStorage.getItem('apiDocDetails')!)
        : {};

    return (
        <>
            <div className="flex shadow-xl w-full">
                {location.pathname !== '/' && <SideBar src={apiDocs} title="API DOCS" />}
                <div
                    className={
                        location.pathname === '/'
                            ? 'w-full'
                            : isMobileWidth
                            ? 'w-full'
                            : 'w-9/12 2xl:w-10/12'
                    }
                >
                    <Outlet />
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
            />
        </>
    );
}
