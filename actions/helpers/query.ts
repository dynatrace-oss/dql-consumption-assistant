import { type QueryTimeFrameType } from '../../ui/app/interfaces/Interfaces';
import { timeframeConverterBasedOnType } from '../../ui/app/utils/helpers';

export const getTracesConsumptionQuery = (
  timeframe: QueryTimeFrameType,
  eventTypeRateCardCost: string,
) => `fetch dt.system.events, ${timeframeConverterBasedOnType(timeframe)}
    | filter event.type == "Traces - Query"
    | filter event.kind == "BILLING_USAGE_EVENT"
    | fieldsAdd client.source
    | dedup query_id
    | summarize {
        billed_bytes = sum(scanned_bytes),
        query_count = countDistinctExact(query_id)
      }, by: {
        app = client.application_context, user = user.email, timestamp
      }
    | fieldsAdd billed_bytes = toDouble(billed_bytes)/1024/1024/1024*toDouble(${eventTypeRateCardCost})`;

export const getEventsConsumptionQuery = (
  timeframe: QueryTimeFrameType,
  eventTypeRateCardCost: string,
) => `fetch dt.system.events, ${timeframeConverterBasedOnType(timeframe)}
    | filter event.type == "Events - Query"
    | filter event.billing.category == "Business events"
    | filter event.kind == "BILLING_USAGE_EVENT"
    | fieldsAdd client.source
    | fieldsAdd query_id = event.id
    | dedup event.id
    | summarize {
      billed_bytes = sum(billed_bytes),
      query_count = countDistinctExact(query_id)
    }, by: {
      app = client.application_context, user = user.email, timestamp
    }
    | fieldsAdd billed_bytes = toDouble(billed_bytes)/1024/1024/1024*toDouble(${eventTypeRateCardCost})`;

export const getHighLogConsumptionQuery = (
  timeframe: QueryTimeFrameType,
  eventTypeRateCardCost: string,
) => `fetch dt.system.events, ${timeframeConverterBasedOnType(timeframe)}
    | filter event.kind == "BILLING_USAGE_EVENT" and event.type == "Log Management & Analytics - Query" and event.version == "1.0"
    | fieldsAdd client.source
    | sort billed_bytes desc | limit 10 |
      lookup [
        fetch dt.system.query_executions
    ],
      sourceField: query_id,
      lookupField: query_id,
      prefix: "executiondata.",
      executionOrder:leftFirst
    | fields
      timestamp=toTimestamp(executiondata.timestamp),
      billed_bytes = toDouble(billed_bytes)/1024/1024/1024*toDouble(${eventTypeRateCardCost}),
      user=user.email,
      app=client.application_context
    | filter isNotNull(timestamp)`;
