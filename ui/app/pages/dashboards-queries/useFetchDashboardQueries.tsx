import { useRateCardContext } from '../../context/rate-card-context/RateCardContext';
import { useAppTimeframeContext } from '../../context/timeframe-context/TimeframeContext';
import useCustomDqlQuery from '../../hooks/useCustomDqlQuery';
import useDocumentsMap from '../../hooks/useDocumentsMap';
import { dashboardsQueries } from '../../queries/queries';
import { giveInsightsCommonFieldsExtractedData } from '../../utils/helpers';
import type { DashboardsQueriesResultType } from './types';

const useFetchDashboardQueries = () => {
  /** Getting selected timeframe from context */
  const { timeframe, isTimeframeContextLoading } = useAppTimeframeContext();

  /** Querying data with selected timeframe*/
  const queryResult = useCustomDqlQuery({
    body: {
      query: dashboardsQueries({ ...timeframe }),
    },
    enabled: !isTimeframeContextLoading,
  });

  /** Document map hook */
  const { documentsMap: dashboardMap, isLoading: isDashboardLoading } = useDocumentsMap({
    filter: "type=='dashboard'", //Filtering by type dashboard
  });

  /** Get RateCard values */
  const rateCardValues = useRateCardContext();

  const modifiedResult: DashboardsQueriesResultType[] =
    !queryResult.isLoading &&
    !rateCardValues.isLoading &&
    !rateCardValues.error.isError &&
    queryResult.data?.records &&
    queryResult.data.records.length > 0
      ? queryResult.data.records.map((eachRecord) => {
          const dashboardId = eachRecord?.dashboard_id as string;
          return {
            'Dashboard Name': dashboardMap.get(dashboardId) ?? 'Private',
            'Dashboard ID': dashboardId,
            'Query': eachRecord?.query_string as string,
            'User': eachRecord?.userEmail as string,
            ...giveInsightsCommonFieldsExtractedData(eachRecord, rateCardValues.rateCard),
          };
        })
      : [];

  return {
    ...queryResult,
    isLoading: queryResult.isLoading || rateCardValues.isLoading || isDashboardLoading,
    data: modifiedResult,
  };
};

export default useFetchDashboardQueries;
