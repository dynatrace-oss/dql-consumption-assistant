import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';

import type { DashboardsUsersResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const { dashboardNameColumn, sharedColumnsForEveryInsights, dashboardIdColumn, tableAndBucketColumns, userColumn } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<DashboardsUsersResultType>[] = [
    ...dashboardNameColumn,
    ...dashboardIdColumn,
    ...tableAndBucketColumns,
    ...userColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
