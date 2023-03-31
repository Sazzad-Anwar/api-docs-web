import { createBrowserRouter } from 'react-router-dom';
import { ERoutes } from './routes.enum';
import { Suspense, lazy } from 'react';
import Loader from '../components/Loader/Index';
import Home from '../pages/Home';
import ApiDetails from '../pages/ApiDetails';
const AddAPI = lazy(() => import('../pages/AddAPI'));
const Error = lazy(() => import('../components/Error/Error'));
const Layout = lazy(() => import('../layouts/Layout'));

const router = createBrowserRouter([
    {
        path: ERoutes.DASHBOARD,
        element: (
            <Suspense fallback={<Loader fullPage />}>
                <Layout />
            </Suspense>
        ),
        errorElement: (
            <Suspense fallback={<Loader fullPage />}>
                <Error />
            </Suspense>
        ),
        children: [
            {
                path: '',
                element: (
                    <Suspense fallback={<Loader fullPage />}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path: ERoutes.API_DETAILS,
                element: (
                    <Suspense fallback={<Loader fullPage />}>
                        <ApiDetails />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: ERoutes.CREATE_API,
        element: (
            <Suspense fallback={<Loader fullPage />}>
                <AddAPI />
            </Suspense>
        ),
        errorElement: (
            <Suspense fallback={<Loader fullPage />}>
                <Error />
            </Suspense>
        ),
    },
]);

export default router;
