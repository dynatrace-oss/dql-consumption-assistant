import { useRateCardContext } from '../../context/rate-card-context/RateCardContext';
import { useAppTimeframeContext } from '../../context/timeframe-context/TimeframeContext';
import useCustomDqlQuery from '../../hooks/useCustomDqlQuery';
import { appsUsers } from '../../queries/queries';
import { giveInsightsCommonFieldsExtractedData } from '../../utils/helpers';
import type { TopUsersQueryResultType } from './types';

const useFetchTopUsersAndApps = () => {
  /** Getting selected timeframe from context */
  const { timeframe, isTimeframeContextLoading } = useAppTimeframeContext();

  /** Querying data with selected timeframe*/
  const queryResult = useCustomDqlQuery({
    body: {
      query: appsUsers({ ...timeframe }),
    },
    enabled: !isTimeframeContextLoading,
  });

  /** Get RateCard values */
  const rateCardValues = useRateCardContext();

  const modifiedResult: TopUsersQueryResultType[] =
    !queryResult.isLoading &&
    !rateCardValues.isLoading &&
    !rateCardValues.error.isError &&
    queryResult.data?.records &&
    queryResult.data.records.length > 0
      ? queryResult.data.records.map((eachRecord) => ({
          'User': eachRecord?.userEmail as string,
          'App Function': eachRecord?.functionContext as string,
          'App ID': eachRecord?.dtApp as string,
          ...giveInsightsCommonFieldsExtractedData(eachRecord, rateCardValues.rateCard),
        }))
      : [];

  return {
    ...queryResult,
    isLoading: queryResult.isLoading || rateCardValues.isLoading,
    data: modifiedResult,
  };
};

export default useFetchTopUsersAndApps;
