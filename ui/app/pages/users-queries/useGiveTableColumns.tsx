import { useIntl } from 'react-intl';
import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import { dtAppHeaderColumnMessage } from '../messages';
import type { UsersQueriesResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const intl = useIntl();

  const { sharedColumnsForEveryInsights, userColumn, tableAndBucketColumns, queryColumn } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<UsersQueriesResultType>[] = [
    ...userColumn,
    ...tableAndBucketColumns,
    {
      header: intl.formatMessage(dtAppHeaderColumnMessage),
      accessor: 'App ID',
      id: 'App ID',
      width: 'content',
    },
    ...queryColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
