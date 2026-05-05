import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import type { TopUsersQueryResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const { sharedColumnsForEveryInsights, userColumn, tableAndBucketColumns } = useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<TopUsersQueryResultType>[] = [
    ...userColumn,
    ...tableAndBucketColumns,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
