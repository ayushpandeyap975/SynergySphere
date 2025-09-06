/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import paths, { rootPaths } from './paths';
import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const ProjectsDashboard = lazy(() => import('pages/ProjectsDashboard'));
const ProjectDetail = lazy(() => import('pages/ProjectDetail'));
const ProjectDashboardDemo = lazy(() => import('components/dashboard/ProjectDashboardDemo'));
const UserProfile = lazy(() => import('pages/UserProfile'));
const Signin = lazy(() => import('pages/authentication/Signin'));
const Signup = lazy(() => import('pages/authentication/Signup'));
const ForgotPassword = lazy(() => import('pages/authentication/ForgotPassword'));
const ResetPassword = lazy(() => import('pages/authentication/ResetPassword'));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
            {
              path: 'projects',
              element: <ProjectsDashboard />,
            },
            {
              path: 'project/:id',
              element: <ProjectDetail />,
            },
            {
              path: 'projects-demo',
              element: <ProjectDashboardDemo />,
            },
            {
              path: 'profile',
              element: <UserProfile />,
            },
          ],
        },
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: paths.signin,
              element: <Signin />,
            },
            {
              path: paths.signup,
              element: <Signup />,
            },
            {
              path: paths.forgotPassword,
              element: <ForgotPassword />,
            },
            {
              path: paths.resetPassword,
              element: <ResetPassword />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: '/dnx',
  },
);

export default router;
