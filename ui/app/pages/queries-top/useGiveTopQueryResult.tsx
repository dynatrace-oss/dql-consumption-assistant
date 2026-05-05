import { useRateCardContext } from '../../context/rate-card-context/RateCardContext';
import { useAppTimeframeContext } from '../../context/timeframe-context/TimeframeContext';
import useCustomDqlQuery from '../../hooks/useCustomDqlQuery';
import { topQueries } from '../../queries/queries';
import { giveInsightsCommonFieldsExtractedData } from '../../utils/helpers';
import type { TopQueriesVolumeResultType } from './types';

const useGiveTopQueryResult = () => {
  /** Getting selected timeframe from context */
  const { timeframe, isTimeframeContextLoading } = useAppTimeframeContext();

  /** Get RateCard values */
  const rateCardValues = useRateCardContext();

  const queryResult = useCustomDqlQuery({
    body: {
      query: topQueries({ ...timeframe }),
    },
    enabled: !isTimeframeContextLoading,
  });

  const dataWithType: TopQueriesVolumeResultType[] =
    !queryResult.isLoading &&
    !rateCardValues.isLoading &&
    !rateCardValues.error.isError &&
    queryResult.data?.records &&
    queryResult.data.records.length > 0
      ? queryResult.data.records.map((eachRecord) => ({
          'Query': eachRecord?.query_string as string,
          'User': eachRecord?.userEmail as string,
          'App ID': eachRecord?.dtApp as string,
          'Timestamp': eachRecord?.timestamp as string,
          ...giveInsightsCommonFieldsExtractedData(eachRecord, rateCardValues.rateCard),
        }))
      : [];
  return {
    ...queryResult,
    isLoading: queryResult.isLoading || rateCardValues.isLoading,
    data: dataWithType,
  };
};

export default useGiveTopQueryResult;
