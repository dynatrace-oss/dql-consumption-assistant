import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import type { DashboardsQueriesResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const {
    sharedColumnsForEveryInsights,
    tableAndBucketColumns,
    dashboardIdColumn,
    userColumn,
    queryColumn,
    dashboardNameColumn,
  } = useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<DashboardsQueriesResultType>[] = [
    ...dashboardNameColumn,
    ...dashboardIdColumn,
    ...tableAndBucketColumns,
    ...userColumn,
    ...queryColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
