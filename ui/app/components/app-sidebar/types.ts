export enum CategoryType {
  DASHBOARDS = 'DASHBOARDS',
  NOTEBOOKS = 'NOTEBOOKS',
  USERS = 'USERS',
  APPS = 'APPS',
  QUERIES = 'QUERIES',
}

export interface SidebarSubItemConfig {
  categorySubType: string;
  displayName: string;
  targetUrl: string;
}

export interface SidebarItemConfig {
  categoryType: CategoryType;
  displayName: string;
  subItems: SidebarSubItemConfig[];
}
