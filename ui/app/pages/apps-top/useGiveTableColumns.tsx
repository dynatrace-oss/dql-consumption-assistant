import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import type { TopAppsQueryResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const { sharedColumnsForEveryInsights, appIdColumn, appFunctionColumn, tableAndBucketColumns } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<TopAppsQueryResultType>[] = [
    ...appIdColumn,
    ...tableAndBucketColumns,
    ...appFunctionColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
