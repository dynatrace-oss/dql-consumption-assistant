import { useIntl } from 'react-intl';
import useCommonColumnsForInsights from '../../hooks/useCommonColumnsForInsights';
import { dtAppHeaderColumnMessage } from '../messages';
import type { UsersAppsResultType } from './types';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

const useGiveTableColumns = () => {
  const intl = useIntl();

  const { sharedColumnsForEveryInsights, userColumn, tableAndBucketColumns } = useCommonColumnsForInsights();

  const columns: DataTableColumnDefinition<UsersAppsResultType>[] = [
    ...userColumn,
    ...tableAndBucketColumns,
    {
      header: intl.formatMessage(dtAppHeaderColumnMessage),
      accessor: 'App ID',
      id: 'App ID',
      width: 'content',
    },
    ...sharedColumnsForEveryInsights,
  ];

  return { columns };
};

export default useGiveTableColumns;
