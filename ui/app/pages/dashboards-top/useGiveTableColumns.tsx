import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import type { TopDashboardsQueryResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const { sharedColumnsForEveryInsights, dashboardIdColumn, dashboardNameColumn, tableAndBucketColumns } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<TopDashboardsQueryResultType>[] = [
    ...dashboardNameColumn,
    ...dashboardIdColumn,
    ...tableAndBucketColumns,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
