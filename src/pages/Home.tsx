import useThemeToggler from '../hooks/useThemeToggle/Index';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';
import { SiPostman } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';

export default function Home() {
    let { theme, toggleTheme } = useThemeToggler();
    let navigate = useNavigate();
    let store = useStore();

    return (
        <div className="h-screen w-full flex flex-col justify-center items-center dark:bg-dark-primary-50 relative">
            <button onClick={toggleTheme} className="absolute right-5 top-5 dark:text-white">
                {theme === 'dark' ? <FaMoon /> : <BsFillSunFill />}
            </button>
            <SiPostman size={60} className="text-[#c16630] mb-3" />
            <h1 className="dark:text-white text-xl">Welcome to API Docs</h1>
            <button
                onClick={() => {
                    if (store?.apiCollections?.length) {
                        navigate(`/collections`);
                    } else {
                        navigate('/collections/create');
                    }
                }}
                className="font-base cursor-pointer lg:font-lg font-ubuntu normal-transition py-1 items-end justify-self-end rounded border border-gray-200 px-14 bg-blue-600 font-medium hover:shadow-lg active:scale-95 dark:border-blue-600 text-white ml-2 mt-3"
            >
                {store?.apiCollections?.length ? 'Go to collections' : 'Create API'}
            </button>
        </div>
    );
}
