import React from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { App } from '../App';
import AppsQueries from '../pages/apps-queries/AppsQueries';
import TopApps from '../pages/apps-top/TopApps';
import AppsUsers from '../pages/apps-users/AppsUsers';
import DashboardQueries from '../pages/dashboards-queries/DashboardQueries';
import TopDashboards from '../pages/dashboards-top/TopDashboards';
import DashboardUsers from '../pages/dashboards-users/DashboardUsers';
import Home from '../pages/Home';
import NotebooksQueries from '../pages/notebooks-queries/NotebooksQueries';
import TopNotebooks from '../pages/notebooks-top/TopNotebooks';
import NotebooksUsers from '../pages/notebooks-users/NotebooksUsers';
import PageNotFound from '../pages/page-not-found/PageNotFound';
import TopQueries from '../pages/queries-top/TopQueries';
import QueryWithoutBestPractices from '../pages/queries-without-best-practices/QueryWithoutBestPractices';
import UserApps from '../pages/users-apps/UserApps';
import UserQueries from '../pages/users-queries/UserQueries';
import TopUsers from '../pages/users-top/TopUsers';
import {
  DashboardsCatergory,
  DynatraceAppsCatergory,
  NotebooksCatergory,
  QueriesCatergory,
  UsersCatergory,
} from './RouteConstants';

export const AppRoutes: RouteObject[] = [
  {
    element: <App />,
    path: '/',
    children: [
      {
        element: <Home />,
        path: '',
        children: [
          /**
           * Dashboards
           */
          {
            element: <TopDashboards />,
            path: DashboardsCatergory.TOP_DASHBOARDS,
          },
          {
            element: <DashboardQueries />,
            path: DashboardsCatergory.DASHBOARDS_QUERIES,
          },
          {
            element: <DashboardUsers />,
            path: DashboardsCatergory.DASHBOARDS_USERS,
          },

          /**
           * Notebooks
           */
          {
            element: <TopNotebooks />,
            path: NotebooksCatergory.TOP_NOTEBOOKS,
          },
          {
            element: <NotebooksQueries />,
            path: NotebooksCatergory.NOTEBOOKS_QUERIES,
          },
          {
            element: <NotebooksUsers />,
            path: NotebooksCatergory.NOTEBOOKS_USERS,
          },

          /**
           * Users
           */
          {
            element: <TopUsers />,
            path: UsersCatergory.TOP_USERS,
          },
          {
            element: <UserQueries />,
            path: UsersCatergory.USERS_QUERIES,
          },
          {
            element: <UserApps />,
            path: UsersCatergory.USERS_APPS,
          },

          /**
           * Apps
           */
          {
            element: <TopApps />,
            path: DynatraceAppsCatergory.TOP_APPS,
          },
          {
            element: <AppsQueries />,
            path: DynatraceAppsCatergory.APPS_QUERIES,
          },
          {
            element: <AppsUsers />,
            path: DynatraceAppsCatergory.APPS_USERS,
          },

          /**
           * Queries
           */
          {
            element: <TopQueries />,
            path: QueriesCatergory.TOP_QUERIES,
          },
          {
            element: <QueryWithoutBestPractices />,
            path: QueriesCatergory.QUERY_WITHOUT_BEST_PRACTICES,
          },

          /**
           * No Page
           */
          {
            element: <PageNotFound />,
            path: '*',
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(AppRoutes, { basename: '/ui' });
