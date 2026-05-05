import { useRateCardContext } from '../../context/rate-card-context/RateCardContext';
import { useAppTimeframeContext } from '../../context/timeframe-context/TimeframeContext';
import useCustomDqlQuery from '../../hooks/useCustomDqlQuery';
import { queriesBestPractices } from '../../queries/queries';
import { giveInsightsCommonFieldsExtractedData } from '../../utils/helpers';
import type { QueriesWithoutBestPracticeResultType } from './types';

const useGiveQueriesWithoutPracticeResult = () => {
  /** Getting selected timeframe from context */
  const { timeframe, isTimeframeContextLoading } = useAppTimeframeContext();

  const rateCardValues = useRateCardContext();

  const queryResult = useCustomDqlQuery({
    body: {
      query: queriesBestPractices({ ...timeframe }),
    },
    enabled: !isTimeframeContextLoading,
  });

  const dataWithType: QueriesWithoutBestPracticeResultType[] =
    !queryResult.isLoading &&
    !rateCardValues.isLoading &&
    !rateCardValues.error.isError &&
    queryResult.data?.records &&
    queryResult.data.records.length > 0
      ? queryResult.data.records.map((eachRecord) => ({
          'App ID': eachRecord?.dtApp as string,
          'User': eachRecord?.userEmail as string,
          'Query': eachRecord?.query_string as string,
          ...giveInsightsCommonFieldsExtractedData(eachRecord, rateCardValues.rateCard),
        }))
      : [];

  return {
    ...queryResult,
    data: dataWithType,
    query: queriesBestPractices({ ...timeframe }),
  };
};

export default useGiveQueriesWithoutPracticeResult;
