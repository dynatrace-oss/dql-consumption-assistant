import { useRateCardContext } from '../../context/rate-card-context/RateCardContext';
import { useAppTimeframeContext } from '../../context/timeframe-context/TimeframeContext';
import useCustomDqlQuery from '../../hooks/useCustomDqlQuery';
import { usersQueries } from '../../queries/queries';
import { giveInsightsCommonFieldsExtractedData } from '../../utils/helpers';
import type { UsersQueriesResultType } from './types';

const useFetchUsersQueries = () => {
  /** Getting selected timeframe from context */
  const { timeframe, isTimeframeContextLoading } = useAppTimeframeContext();

  /** Querying data with selected timeframe*/
  const queryResult = useCustomDqlQuery({
    body: {
      query: usersQueries({ ...timeframe }),
    },
    enabled: !isTimeframeContextLoading,
  });

  /** Get RateCard values */
  const rateCardValues = useRateCardContext();

  const modifiedResult: UsersQueriesResultType[] =
    !queryResult.isLoading &&
    !rateCardValues.isLoading &&
    !rateCardValues.error.isError &&
    queryResult.data?.records &&
    queryResult.data.records.length > 0
      ? queryResult.data.records.map((eachRecord) => ({
          'App ID': eachRecord?.dtApp as string,
          'Query': eachRecord?.query_string as string,
          'User': eachRecord?.userEmail as string,
          ...giveInsightsCommonFieldsExtractedData(eachRecord, rateCardValues.rateCard),
        }))
      : [];

  return {
    ...queryResult,
    isLoading: queryResult.isLoading || rateCardValues.isLoading,
    data: modifiedResult,
  };
};

export default useFetchUsersQueries;
