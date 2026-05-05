import { useIntl } from 'react-intl';
import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import { type DataTableColumnDefinition } from '../../interfaces/Interfaces';
import { dtAppHeaderColumnMessage } from '../messages';
import { type TopQueriesVolumeResultType } from './types';

const useGiveTableColumns = () => {
  const intl = useIntl();

  const { sharedColumnsForEveryInsights, tableAndBucketColumns, userColumn, queryColumn } =
    useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<TopQueriesVolumeResultType>[] = [
    {
      header: 'Timestamp',
      accessor: 'Timestamp',
      id: 'Timestamp',
      sortType: 'datetime',
      columnType: 'date',
      alignment: 'center',
    },
    {
      header: intl.formatMessage(dtAppHeaderColumnMessage),
      accessor: 'App ID',
      id: 'App ID',
      width: 'content',
    },
    ...tableAndBucketColumns,
    ...userColumn,
    ...queryColumn,
    sharedColumnsForEveryInsights[2],
    sharedColumnsForEveryInsights[3],
    sharedColumnsForEveryInsights[4],
    sharedColumnsForEveryInsights[5],
  ];

  return { columns };
};

export default useGiveTableColumns;
