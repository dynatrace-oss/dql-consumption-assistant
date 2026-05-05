import { useRateCardContext } from '../../context/rate-card-context/RateCardContext';
import { useAppTimeframeContext } from '../../context/timeframe-context/TimeframeContext';
import useCustomDqlQuery from '../../hooks/useCustomDqlQuery';
import useDocumentsMap from '../../hooks/useDocumentsMap';
import { topDashboards } from '../../queries/queries';
import { giveInsightsCommonFieldsExtractedData } from '../../utils/helpers';
import type { TopDashboardsQueryResultType } from './types';

const useFetchTopDashboards = () => {
  /** Getting selected timeframe from context */
  const { timeframe, isTimeframeContextLoading } = useAppTimeframeContext();

  const query = topDashboards({ ...timeframe });

  /** Querying data with selected timeframe*/
  const queryResult = useCustomDqlQuery({
    body: { query },
    enabled: !isTimeframeContextLoading,
  });

  /** Document map hook */
  const { documentsMap: dashboardMap, isLoading: isDashboardLoading } = useDocumentsMap({
    filter: "type=='dashboard'", //Filtering by type dashboard
  });

  /** Get RateCard values */
  const rateCardValues = useRateCardContext();

  const modifiedResult: TopDashboardsQueryResultType[] =
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

export default useFetchTopDashboards;
