import { AccountIcon, AppsIcon, CodeIcon, NodeIcon, QueryTreeIcon } from '@dynatrace/strato-icons';
import React from 'react';
import { CategoryType } from './types';

const ICONS: Record<CategoryType, React.JSX.Element> = {
  [CategoryType.DASHBOARDS]: <NodeIcon />,
  [CategoryType.NOTEBOOKS]: <CodeIcon />,
  [CategoryType.USERS]: <AccountIcon />,
  [CategoryType.APPS]: <AppsIcon />,
  [CategoryType.QUERIES]: <QueryTreeIcon />,
};

export const getIconByCategoryType = (categoryType: CategoryType): React.JSX.Element => {
  return ICONS[categoryType];
};
