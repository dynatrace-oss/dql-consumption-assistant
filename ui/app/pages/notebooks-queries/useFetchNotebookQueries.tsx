import { useRateCardContext } from '../../context/rate-card-context/RateCardContext';
import { useAppTimeframeContext } from '../../context/timeframe-context/TimeframeContext';
import useCustomDqlQuery from '../../hooks/useCustomDqlQuery';
import useDocumentsMap from '../../hooks/useDocumentsMap';
import { notebooksQueries } from '../../queries/queries';
import { giveInsightsCommonFieldsExtractedData } from '../../utils/helpers';
import type { NotebooksQueriesResultType } from './types';

const useFetchNotebookQueries = () => {
  /** Getting selected timeframe from context */
  const { timeframe, isTimeframeContextLoading } = useAppTimeframeContext();

  /** Querying data with selected timeframe*/
  const queryResult = useCustomDqlQuery({
    body: {
      query: notebooksQueries({ ...timeframe }),
    },
    enabled: !isTimeframeContextLoading,
  });

  /** Document map hook */
  const { documentsMap: notebooksMap, isLoading: isNotebookLoading } = useDocumentsMap({
    filter: "type=='notebook'", //Filtering by type notebook
  });

  /** Get RateCard values */
  const rateCardValues = useRateCardContext();

  const modifiedResult: NotebooksQueriesResultType[] =
    !queryResult.isLoading &&
    !rateCardValues.isLoading &&
    !rateCardValues.error.isError &&
    queryResult.data?.records &&
    queryResult.data.records.length > 0
      ? queryResult.data.records.map((eachRecord) => {
          const notebookId = eachRecord?.notebook_id as string;
          return {
            'Notebook Name': notebooksMap.get(notebookId) ?? 'Private',
            'Notebook ID': notebookId,
            'Query': eachRecord?.query_string as string,
            'User': eachRecord?.userEmail as string,
            ...giveInsightsCommonFieldsExtractedData(eachRecord, rateCardValues.rateCard),
          };
        })
      : [];

  return {
    ...queryResult,
    isLoading: queryResult.isLoading || rateCardValues.isLoading || isNotebookLoading,
    data: modifiedResult,
  };
};

export default useFetchNotebookQueries;
