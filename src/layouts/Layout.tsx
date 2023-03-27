import SideBar from '../components/SideBar/Index';
import api from '../assets/APi.json';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useThemeToggler from '../hooks/useThemeToggle/Index';

export default function Layout() {
    const { theme } = useThemeToggler();

    return (
        <>
            <div className="flex shadow-xl">
                <SideBar src={api} title="JSON placeholder API" />
                <div className="w-full">
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
