import {
  DashboardsCatergory,
  DynatraceAppsCatergory,
  NotebooksCatergory,
  QueriesCatergory,
  UsersCatergory,
} from '../../routes/RouteConstants';
import { CategoryType, type SidebarItemConfig, type SidebarSubItemConfig } from './types';

export const getSidebarConfig = (search?: string): SidebarItemConfig[] =>
  [
    {
      categoryType: CategoryType.DASHBOARDS,
      displayName: 'Dashboards',
      subItems: [
        {
          categorySubType: 'top-dashboards',
          displayName: 'Top Dashboards',
          targetUrl: DashboardsCatergory.TOP_DASHBOARDS,
        },
        {
          categorySubType: 'dashboard-users',
          displayName: 'Users',
          targetUrl: DashboardsCatergory.DASHBOARDS_USERS,
        },
        {
          categorySubType: 'dashboard-queries',
          displayName: 'Queries',
          targetUrl: DashboardsCatergory.DASHBOARDS_QUERIES,
        },
      ],
    },
    {
      categoryType: CategoryType.NOTEBOOKS,
      displayName: 'Notebooks',
      subItems: [
        {
          categorySubType: 'top-notebooks',
          displayName: 'Top Notebooks',
          targetUrl: NotebooksCatergory.TOP_NOTEBOOKS,
        },
        {
          categorySubType: 'notebook-users',
          displayName: 'Users',
          targetUrl: NotebooksCatergory.NOTEBOOKS_USERS,
        },
        {
          categorySubType: 'notebook-queries',
          displayName: 'Queries',
          targetUrl: NotebooksCatergory.NOTEBOOKS_QUERIES,
        },
      ],
    },
    {
      categoryType: CategoryType.USERS,
      displayName: 'Users',
      subItems: [
        {
          categorySubType: 'top-users',
          displayName: 'Top Users',
          targetUrl: UsersCatergory.TOP_USERS,
        },
        {
          categorySubType: 'user-apps',
          displayName: 'Apps',
          targetUrl: UsersCatergory.USERS_APPS,
        },
        {
          categorySubType: 'user-queries',
          displayName: 'Queries',
          targetUrl: UsersCatergory.USERS_QUERIES,
        },
      ],
    },
    {
      categoryType: CategoryType.APPS,
      displayName: 'Apps',
      subItems: [
        {
          categorySubType: 'top-apps',
          displayName: 'Top Apps',
          targetUrl: DynatraceAppsCatergory.TOP_APPS,
        },
        {
          categorySubType: 'app-users',
          displayName: 'Users',
          targetUrl: DynatraceAppsCatergory.APPS_USERS,
        },
        {
          categorySubType: 'app-queries',
          displayName: 'Queries',
          targetUrl: DynatraceAppsCatergory.APPS_QUERIES,
        },
      ],
    },
    {
      categoryType: CategoryType.QUERIES,
      displayName: 'Queries',
      subItems: [
        {
          categorySubType: 'top-queries',
          displayName: 'Top Queries',
          targetUrl: QueriesCatergory.TOP_QUERIES,
        },
        {
          categorySubType: 'best-practices',
          displayName: 'Best Practices',
          targetUrl: QueriesCatergory.QUERY_WITHOUT_BEST_PRACTICES,
        },
      ],
    },
  ].map((eachCategory) => ({
    ...eachCategory,
    subItems: eachCategory.subItems.map((sub: SidebarSubItemConfig) => ({ ...sub, targetUrl: `${sub.targetUrl}${search}` })),
  }));
