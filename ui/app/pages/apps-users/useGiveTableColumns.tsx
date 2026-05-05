import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';

import type { TopUsersQueryResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const { sharedColumnsForEveryInsights, appIdColumn, appFunctionColumn, tableAndBucketColumns, userColumn } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<TopUsersQueryResultType>[] = [
    ...appIdColumn,
    ...tableAndBucketColumns,
    ...appFunctionColumn,
    ...userColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
