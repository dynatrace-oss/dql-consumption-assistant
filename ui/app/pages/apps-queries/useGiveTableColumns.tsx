import useCommonColumnsForInsights from "../../hooks/useCommonColumnsForInsights";
import type { TopQueriesQueryResultType } from "./types";
import type { DataTableColumnDefinition } from "../../interfaces/Interfaces";

const useGiveTableColumns = () => {
  const {
    sharedColumnsForEveryInsights,
    tableAndBucketColumns,
    userColumn,
    queryColumn,
    appIdColumn,
    appFunctionColumn,
  } = useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<TopQueriesQueryResultType>[] = [
    ...appIdColumn,
    ...tableAndBucketColumns,
    ...appFunctionColumn,
    ...userColumn,
    ...queryColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
