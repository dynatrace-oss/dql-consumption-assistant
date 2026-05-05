import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import type { TopNotebooksQueryResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const { sharedColumnsForEveryInsights, notebookIdColumn, tableAndBucketColumns, notebookNameColumn } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<TopNotebooksQueryResultType>[] = [
    ...notebookNameColumn,
    ...notebookIdColumn,
    ...tableAndBucketColumns,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
