import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import type { NotebooksUsersQueryResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const { sharedColumnsForEveryInsights, notebookIdColumn, tableAndBucketColumns, userColumn, notebookNameColumn } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<NotebooksUsersQueryResultType>[] = [
    ...notebookNameColumn,
    ...notebookIdColumn,
    ...tableAndBucketColumns,
    ...userColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
