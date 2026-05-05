import {
  queryExecutionClient,
  type QueryPollResponse,
  type QueryResult,
} from "@dynatrace-sdk/client-query";
import { isUndefined } from "lodash-es";
import { useCallback, useEffect, useState, useRef } from "react";
import type { ErrorResponseFromGrail } from "../interfaces/Interfaces";

interface CustomDqlHookProps {
  body: {
    query: string;
  };
  enabled?: boolean;
}

interface QueryStateType {
  data: QueryResult | undefined;
  error: ErrorResponseFromGrail;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  status: "not-requested" | "loading" | "success" | "error";
  refetch: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  cancel: () => Promise<QueryPollResponse | unknown>;
}

const hookInitialState: QueryStateType = {
  isLoading: true,
  isError: false,
  isSuccess: false,
  data: undefined,
  status: "loading",
  error: undefined,
  refetch: async () => Promise.resolve(undefined),
  cancel: async () => Promise.resolve(undefined),
};

const awaitForQueryResults = async (timeout: number = 60000) => {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Waiting for query results timed out"));
    }, timeout);

    // Simulating a 1-second wait (e.g., polling interval)
    setTimeout(() => {
      clearTimeout(timer); // Clear timeout if we resolve in time
      resolve();
    }, 1000); // Simulate a polling interval
  });
};

/**
 * Motive of creating custom hook, instead of using useDqlQuery
 *
 *  Problem :
 *             While using the default `useDqlQuery` hook, from `sdk`, when ever the query's timeframe changes/modifies,
 *             the hook used to re-fetch the data. This solution is not suitable for this app
 *
 *  Solution:
 *            Created a custom hook called, `useCustomDqlQuery` by using `queryExecutionClient`.
 *            This hook solves the above problem.
 *            Even if query's timeframe changes, this hook wont execute or re-fetch the data, until the `refetch` is called.
 *            This custom hook also returns the same exact properties, which are returned from `useDqlQuery` hook
 */

const useCustomDqlQuery = ({
  body,
  enabled,
}: CustomDqlHookProps): QueryStateType => {
  const [state, setState] = useState<QueryStateType>(hookInitialState);
  const requestTokenRef = useRef<string | null>(null); // Using useRef for persistent requestToken across renders

  const queryFunction = useCallback(async (query: string) => {
    try {
      const res = await queryExecutionClient.queryExecute({
        body: {
          query,
        },
      });

      if (res.requestToken) {
        let queryData: QueryResult | undefined;
        requestTokenRef.current = res.requestToken; // Store requestToken in the ref
        while (queryData === undefined) {
          await awaitForQueryResults();
          queryData = await queryExecutionClient
            .queryPoll({ requestToken: res.requestToken })
            .then((resp) => resp.result);
        }
        setState((prev) => ({
          ...prev,
          data: queryData,
          isLoading: false,
          isSuccess: true,
          status: "success",
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isSuccess: false,
        status: "error",
        isError: true,
        error: err as ErrorResponseFromGrail,
      }));
    }
  }, []);

  const cancelQueryExecution = useCallback(async () => {
    if (requestTokenRef.current) {
      try {
        return await queryExecutionClient.queryCancel({
          requestToken: requestTokenRef.current,
        }); // Return response or handle cancellation success
      } catch {
        console.error("Failed to cancel the query");
      }
    }
  }, []);

  const refetchQueryExecution = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      status: "loading",
      isLoading: true,
      isError: false,
      isSuccess: false,
    }));
    await queryFunction(body.query); // Refetch the query
  }, [body.query, queryFunction]);

  useEffect(() => {
    // run the query only on two conditions
    /**
     * Case 1: user didn't provided enabled: value. so here enabled is `undefined`. so this is default case, should query data automatically
     * Case 2: user provided enabled: values(true/false). if only on true execute the query
     * This is how, exactly useQuery from `react-query` works
     */
    if (isUndefined(enabled) || enabled) {
      void queryFunction(body.query);
    }
    // adding queryString in dep array, will cause again re-render. which is not required
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFunction, enabled]);

  return {
    ...state,
    refetch: refetchQueryExecution,
    cancel: cancelQueryExecution,
  };
};

export default useCustomDqlQuery;
