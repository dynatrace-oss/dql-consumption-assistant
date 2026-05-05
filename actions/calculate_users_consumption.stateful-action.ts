import {
  type StatefulAction,
  userLogger,
  UnsuccessfulActionError,
} from '@dynatrace-sdk/automation-action-utils/actions';
import { queryExecutionClient } from '@dynatrace-sdk/client-query';
import { HighConsumptionUsers } from '../ui/app/services/types/workflowValidation';
import { getPriceOfGivenEventName } from '../ui/app/utils/helpers';
import { QUERY_EVENT } from './helpers/constants';
import { getAuthToken } from './helpers/getAuthToken';
import { getEventsConsumptionQuery, getHighLogConsumptionQuery, getTracesConsumptionQuery } from './helpers/query';
import { getAllGroupsOfUserUrl, getAppSettings } from './helpers/settingsUtils';
import { getAllGroupsOfUser, mapUserGroups, processQueryResults } from './helpers/userConsumptionActionHelper';
import type { EventTypeKey, ExecuteDqlQueryInput, TokenResult, UserGroupMappedResult } from './helpers/types';
import type { QueryTimeFrameType } from '../ui/app/interfaces/Interfaces';

// map event type to the corresponding query
const QUERY_BUILDERS: Record<EventTypeKey, (t: QueryTimeFrameType, cost: string) => string> = {
  logs: getHighLogConsumptionQuery,
  traces: getTracesConsumptionQuery,
  events: getEventsConsumptionQuery,
};

const getHighConsumptionUsers: StatefulAction<
  ExecuteDqlQueryInput | { eventType: string; timeframe: unknown; requestToken?: string },
  TokenResult & { eventType: string; timeframe: unknown },
  UserGroupMappedResult[]
> = async (rawPayload: unknown) => {
  if (!rawPayload) {
    throw new UnsuccessfulActionError('Payload is required but was not provided.');
  }

  /**
   * "safeParse" is used because it gives you a clean way to inspect validation errors before throwing your custom error.
   * With parse, the error would be thrown immediately, and you wouldn’t easily control how to log it or transform it.
   * This pattern avoids try/catch clutter and gives structured error handling.
   */
  const parsed = HighConsumptionUsers.safeParse(rawPayload);
  if (!parsed.success) {
    userLogger.error(JSON.stringify(parsed.error, null, 2));
    throw new UnsuccessfulActionError('Invalid payload. Check logs for details.');
  }

  const { eventType, timeframe, rateCard: rateCardValues, requestToken: token } = parsed.data;

  // get the event type string from payload
  const eventTypeKey = QUERY_EVENT[eventType as EventTypeKey];

  const eventTypeRateCardCost =
    rateCardValues.length > 0 ? getPriceOfGivenEventName(rateCardValues, eventTypeKey) : '0';

  // Get App Settings
  const settingsValue = await getAppSettings();

  let requestToken = token ?? ''; // carry over from previous run if resuming

  /**
   * Executes a query and waits for its result using polling.
   *
   * Why polling?
   * Some queries take a long time to finish (for example, when large grail records).
   * Instead of waiting and getting stuck, the system returns a `requestToken`.
   * We use this token to keep checking (polling) whether the query is still running, has failed, or has completed.
   *
   * How it works:
   * - If an existing `requestToken` is provided, resume polling that execution.
   * - If no token is provided, start a new query execution and get a new token.
   * - Poll the query state:
   *   - Returns `{ state: 'RUNNING', requestToken }` if the query is still running.
   *   - Returns `{ state: 'DONE', result }` once the query completes successfully.
   *   - Throws if the query fails or no result is available.
   */

  // pick correct query dynamically based on event type
  const buildQuery = QUERY_BUILDERS[eventType as EventTypeKey];
  const query = buildQuery(timeframe as QueryTimeFrameType, eventTypeRateCardCost);

  if (!requestToken) {
    const res = await queryExecutionClient.queryExecute({
      body: {
        query,
        requestTimeoutMilliseconds: 0,
      },
    });

    if (!res.requestToken) {
      throw new UnsuccessfulActionError('No requestToken returned from queryExecute.');
    }

    requestToken = res.requestToken;
    userLogger.info(`Started Fetching..`);
  }

  // Poll with the token
  const pollResponse = await queryExecutionClient.queryPoll({
    requestToken,
    requestTimeoutMilliseconds: 0,
  });

  if (pollResponse.state === 'RUNNING') {
    userLogger.info(`Resuming with token`);
    // save requestToken in payload for the next resume
    return {
      result: { eventType, timeframe, rateCardValues, requestToken },
      resume: 'later',
    };
  }

  if (pollResponse.state === 'FAILED') {
    throw new UnsuccessfulActionError('Query execution failed.');
  }

  if (!pollResponse.result) {
    throw new UnsuccessfulActionError('No result returned from queryPoll.');
  }

  const threshold = settingsValue.global_threshold ?? 0;
  const queryResult = pollResponse.result;
  const exceedingRecords = processQueryResults(queryResult.records, threshold);

  //** EXAMPLE RESULT ------------------*/
  // const exceedingRecords = [{ App: 'some app', query_cost: 6, timestamp: '', User: 'priyapathak.work@gmail.com' }];

  const authToken = await getAuthToken(settingsValue);

  const recordsWithGroups = await Promise.all(
    exceedingRecords.map(async (record) => {
      try {
        const groupMembersUrl = getAllGroupsOfUserUrl(String(settingsValue.account_id), record.User);

        const response = await getAllGroupsOfUser(groupMembersUrl, authToken);
        return mapUserGroups(response, record.query_cost, settingsValue);
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('404')) {
          userLogger.warn(`Skipping user ${record.User}: not found`);
          return null;
        }
        throw err; // rethrow if not 404
      }
    }),
  );

  // filter out skipped users, .filter(Boolean) is a shorthand for removing all falsy values (null, undefined, false, 0, '') from the array.
  const filteredRecords = recordsWithGroups.filter(Boolean);

  // filter out nulls
  const validUserRecordsWithGroups = filteredRecords.filter((r): r is UserGroupMappedResult => r !== null);

  userLogger.info('Logs query completed successfully. Returning mapped user group results.');
  return { result: validUserRecordsWithGroups };
};

export default getHighConsumptionUsers;
