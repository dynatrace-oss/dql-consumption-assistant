import { Button } from '@dynatrace/strato-components/buttons';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExternalLinkComponentForDirectLink } from '../components/external-link/ExternalLinkComponent';
import { DASHBOARD_APP_ID, NOTEBOOK_APP_ID } from '../constants/appIds';
import { TABLE_SORT_TYPE_FOR_ALL_COLUMNS } from '../constants/constants';
import { useRateCardContext } from '../context/rate-card-context/RateCardContext';
import {
  appFunctionHeaderColumnMessage,
  averageScannedHeaderColumnMessage,
  bucketColumnHeaderMessage,
  costColumnHeaderMessage,
  dashboardIdColumnHeaderMessage,
  dashboardNameColumnHeaderMessage,
  dashboardNameMessage,
  dtAppHeaderColumnMessage,
  executionsColumnHeaderMessage,
  goToAppMessage,
  includedScannedHeaderColumnMessage,
  notebookIdColumnHeaderMessage,
  notebookNameColumnHeaderMessage,
  notebookNameMessage,
  onDemandScannedHeaderColumnMessage,
  queryStringColumnHeaderMessage,
  tableColumnHeaderMessage,
  toatlScannedHeaderColumnMessage,
  userColumnHeaderMessage,
} from '../pages/messages';
import { giveApplicationUrlBasedOnAppNameFromQueryResult } from '../utils/helpers';
import type { DataTableColumnDefinition, CommonFieldsForInsights, InsightFieldType } from '../interfaces/Interfaces';

/**
 *
 * @returns Common Columns for All DQL Insights
 */

const useCommonColumnsForInsights = () => {
  /** React-Intl */
  const intl = useIntl();

  /** RateCard Context */
  const { isLoading, rateCard } = useRateCardContext();
  const currencyCode = isLoading ? 'loading' : rateCard[0].currencyCode;

  const sharedColumnsForEveryInsights: DataTableColumnDefinition<CommonFieldsForInsights>[] = [
    {
      header: intl.formatMessage(executionsColumnHeaderMessage),
      accessor: 'Executions',
      id: 'Executions',
      width: '1fr',
      sortType: TABLE_SORT_TYPE_FOR_ALL_COLUMNS,
    },
    {
      header: intl.formatMessage(averageScannedHeaderColumnMessage),
      accessor: 'Average GiB',
      id: 'Average GiB',
      width: '1fr',
      sortType: TABLE_SORT_TYPE_FOR_ALL_COLUMNS,
    },
    {
      header: intl.formatMessage(toatlScannedHeaderColumnMessage),
      accessor: 'Total GiB',
      id: 'Total GiB',
      width: '1fr',
      sortType: TABLE_SORT_TYPE_FOR_ALL_COLUMNS,
    },
    {
      header: intl.formatMessage(includedScannedHeaderColumnMessage),
      accessor: 'Included GiB',
      id: 'Included GiB',
      width: '1fr',
      sortType: TABLE_SORT_TYPE_FOR_ALL_COLUMNS,
    },
    {
      header: intl.formatMessage(onDemandScannedHeaderColumnMessage),
      accessor: 'On Demand GiB',
      id: 'On Demand GiB',
      width: '1fr',
      sortType: TABLE_SORT_TYPE_FOR_ALL_COLUMNS,
    },
    {
      header: intl.formatMessage(costColumnHeaderMessage, { currencyCode }),
      accessor: 'Cost',
      id: 'Cost',
      width: 'content',
      sortType: TABLE_SORT_TYPE_FOR_ALL_COLUMNS,
    },
  ];

  const tableAndBucketColumns: DataTableColumnDefinition<Pick<CommonFieldsForInsights, 'Table' | 'Bucket'>>[] = [
    {
      header: intl.formatMessage(tableColumnHeaderMessage),
      accessor: 'Table',
      id: 'Table',
      width: 'content',
    },
    {
      header: intl.formatMessage(bucketColumnHeaderMessage),
      accessor: 'Bucket',
      id: 'Bucket',
      width: '1fr',
    },
  ];

  const dashboardIdColumn: DataTableColumnDefinition<{ 'Dashboard ID': InsightFieldType }>[] = [
    {
      header: intl.formatMessage(dashboardIdColumnHeaderMessage),
      accessor: 'Dashboard ID',
      id: 'Dashboard ID',
    },
  ];

  const dashboardNameColumn: DataTableColumnDefinition<{
    'Dashboard Name': InsightFieldType;
    'Dashboard ID': InsightFieldType;
  }>[] = [
    {
      header: intl.formatMessage(dashboardNameColumnHeaderMessage),
      accessor: 'Dashboard Name',
      id: 'Dashboard Name',
      width: 'content',
      cell: ({ rowData }) => {
        const dashboardLink = giveApplicationUrlBasedOnAppNameFromQueryResult(DASHBOARD_APP_ID);

        return (
          <div style={{ padding: '10px 6px', textAlign: 'center' }}>
            <ExternalLinkComponentForDirectLink
              href={`${dashboardLink}/dashboard/${rowData['Dashboard ID']}`}
              message={dashboardNameMessage}
              values={{ dashboard: rowData['Dashboard Name'] as string }}
            />
          </div>
        );
      },
    },
  ];

  const notebookIdColumn: DataTableColumnDefinition<{ 'Notebook ID': InsightFieldType }>[] = [
    {
      header: intl.formatMessage(notebookIdColumnHeaderMessage),
      accessor: 'Notebook ID',
      id: 'Notebook ID',
    },
  ];

  const notebookNameColumn: DataTableColumnDefinition<{
    'Notebook ID': InsightFieldType;
    'Notebook Name': InsightFieldType;
  }>[] = [
    {
      header: intl.formatMessage(notebookNameColumnHeaderMessage),
      accessor: 'Notebook Name',
      id: 'Notebook Name',
      width: 'content',
      cell: ({ rowData }) => {
        const notebookLink = giveApplicationUrlBasedOnAppNameFromQueryResult(NOTEBOOK_APP_ID);

        return (
          <div style={{ padding: '10px 6px', textAlign: 'center' }}>
            <ExternalLinkComponentForDirectLink
              href={`${notebookLink}/notebook/${rowData['Notebook ID']}`}
              message={notebookNameMessage}
              values={{ notebook: rowData['Notebook Name'] as string }}
            />
          </div>
        );
      },
    },
  ];

  const userColumn: DataTableColumnDefinition<{ User: InsightFieldType }>[] = [
    {
      header: intl.formatMessage(userColumnHeaderMessage),
      accessor: 'User',
      id: 'User',
    },
  ];

  const queryColumn: DataTableColumnDefinition<{ Query: InsightFieldType }>[] = [
    {
      header: intl.formatMessage(queryStringColumnHeaderMessage),
      accessor: 'Query',
      id: 'Query',
    },
  ];

  const appIdColumn: DataTableColumnDefinition<{ 'App ID': InsightFieldType }>[] = [
    {
      header: intl.formatMessage(dtAppHeaderColumnMessage),
      accessor: 'App ID',
      id: 'App ID',
      width: 'content',
      cell: ({ rowData }) => {
        const appName = rowData['App ID'];
        const LOCAL_DEV_MODE = 'local-dev-mode';
        return (
          <Button>
            {appName === LOCAL_DEV_MODE ? (
              <FormattedMessage defaultMessage='No App Found' id='Tl96gRPteL1e7IVs' />
            ) : (
              <ExternalLinkComponentForDirectLink
                href={giveApplicationUrlBasedOnAppNameFromQueryResult(appName as string)}
                message={goToAppMessage}
                values={{ app: appName as string }}
              />
            )}
          </Button>
        );
      },
    },
  ];

  const appFunctionColumn: DataTableColumnDefinition<{ 'App Function': InsightFieldType }>[] = [
    {
      header: intl.formatMessage(appFunctionHeaderColumnMessage),
      accessor: 'App Function',
      id: 'App Function',
      width: '1fr',
    },
  ];

  return {
    sharedColumnsForEveryInsights,
    tableAndBucketColumns,
    dashboardNameColumn,
    dashboardIdColumn,
    notebookNameColumn,
    notebookIdColumn,
    userColumn,
    queryColumn,
    appIdColumn,
    appFunctionColumn,
  };
};

export default useCommonColumnsForInsights;
