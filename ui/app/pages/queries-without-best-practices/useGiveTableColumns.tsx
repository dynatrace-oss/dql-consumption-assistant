import { useIntl } from 'react-intl';
import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import { dtAppHeaderColumnMessage } from '../messages';
import type { QueriesWithoutBestPracticeResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const intl = useIntl();

  const { sharedColumnsForEveryInsights, tableAndBucketColumns, userColumn, queryColumn } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<QueriesWithoutBestPracticeResultType>[] = [
    {
      header: intl.formatMessage(dtAppHeaderColumnMessage),
      accessor: 'App ID',
      id: 'App ID',
      width: 'content',
    },
    ...tableAndBucketColumns,
    ...userColumn,
    ...queryColumn,
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
