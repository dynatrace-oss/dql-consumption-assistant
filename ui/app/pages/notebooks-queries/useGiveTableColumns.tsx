import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import type { NotebooksQueriesResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const {
    sharedColumnsForEveryInsights,
    notebookIdColumn,
    tableAndBucketColumns,
    queryColumn,
    userColumn,
    notebookNameColumn,
  } = useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<NotebooksQueriesResultType>[] = [
    ...notebookNameColumn,
    ...notebookIdColumn,
    ...tableAndBucketColumns,
    ...userColumn,
    ...queryColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
