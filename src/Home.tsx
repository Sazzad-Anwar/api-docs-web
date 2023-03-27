import useThemeToggler from './hooks/useThemeToggle/Index';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';

export default function Home() {
    let { theme, toggleTheme } = useThemeToggler();
    return (
        <div className="h-screen w-full flex justify-center items-center dark:bg-dark-primary-50 relative">
            <button onClick={toggleTheme} className="absolute right-5 top-5 dark:text-white">
                {theme === 'dark' ? <FaMoon /> : <BsFillSunFill />}
            </button>
            <h1 className="dark:text-white text-xl">Welcome to API Docs</h1>
        </div>
    );
}
