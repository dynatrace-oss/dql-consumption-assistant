import { useRateCardContext } from '../../context/rate-card-context/RateCardContext';
import { useAppTimeframeContext } from '../../context/timeframe-context/TimeframeContext';
import useCustomDqlQuery from '../../hooks/useCustomDqlQuery';
import { topApps } from '../../queries/queries';
import { giveInsightsCommonFieldsExtractedData } from '../../utils/helpers';
import type { TopAppsQueryResultType } from './types';

const useFetchTopApps = () => {
  /** Getting selected timeframe from context */
  const { timeframe, isTimeframeContextLoading } = useAppTimeframeContext();

  /** Querying data with selected timeframe*/
  const queryResult = useCustomDqlQuery({
    body: {
      query: topApps({ ...timeframe }),
    },
    enabled: !isTimeframeContextLoading,
  });

  /** Get RateCard values */
  const rateCardValues = useRateCardContext();

  const modifiedResult: TopAppsQueryResultType[] =
    !queryResult.isLoading &&
    !rateCardValues.isLoading &&
    !rateCardValues.error.isError &&
    queryResult.data?.records &&
    queryResult.data.records.length > 0
      ? queryResult.data.records.map((eachRecord) => ({
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

export default useFetchTopApps;
