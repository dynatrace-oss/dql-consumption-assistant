/**
 * Global types and interfaces, used/imported across many places in app
 */

import { type TimeValue } from '@dynatrace/strato-components-preview/core';
import { type DataTableColumnDef } from '@dynatrace/strato-components-preview/tables';
import { type ErrorResponse } from '@dynatrace-sdk/client-query';

export interface QueryTimeFrameType {
  from: TimeValue;
  to: TimeValue;
}

export interface RunQueryButtonType {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  handleRunQueryClick: VoidFunction;
}

/**
 * Type of settings
 */

export type RateCardType = 'account' | 'default';

export interface SettingsSchemaType {
  rate_card_type: RateCardType;
  client_id?: string;
  client_secret?: string;
  account_id?: string;
  global_threshold?: number;
  custom_thresholds?: {
    group_name: string;
    threshold: number;
  }[];
  events_cooldown_group?: string;
  traces_cooldown_group?: string;
  logs_cooldown_group?: string;
}

/**
 * Ratecard types
 */
export interface RateCardCapabilitiesType {
  key: string;
  name: string;
  quotedPrice: string;
  quotedUnitOfMeasure: string;
  price: string;
}

export interface RateCardResponse {
  quoteNumber: string;
  startTime: string;
  endTime: string;
  currencyCode: string;
  capabilities: RateCardCapabilitiesType[];
}

/**
 * Available Sort Type for DataTableV2
 */

export type SortType = 'text' | 'number' | 'textCaseSensitive' | 'datetime';

/**
 * App Function -> `get-settings-values` Response Type
 */
export interface GetSettingsValuesAppFunctionResponse {
  error?: string;
  data?: RateCardResponse[];
}

/**
 * DataTable Column Definition
 * Used in multiple places of app
 */
export type DataTableColumnDefinition<T> = DataTableColumnDef<T>;

/**
 * Error Type from DQL Grail Query
 */
export type ErrorResponseFromGrail = ErrorResponse | undefined;

/** Field Type from Grail */
export type InsightFieldType = string | null;

/** Common Fields For All Insights */
export interface CommonFieldsForInsights {
  'Table': InsightFieldType;
  'Bucket': InsightFieldType;
  'Executions': InsightFieldType;
  'Average GiB': InsightFieldType;
  'Total GiB': InsightFieldType;
  'Included GiB': InsightFieldType;
  'On Demand GiB': InsightFieldType;
  'Cost': InsightFieldType;
}

/** Fields that are not common in insights */
export interface OtherFieldsForInsights {
  'Dashboard ID': InsightFieldType;
  'Notebook ID': InsightFieldType;
  'User': InsightFieldType;
  'Query': InsightFieldType;
  'App ID': InsightFieldType; // shows app id. Used in App category section
  'App Function': InsightFieldType;
  'Timestamp': InsightFieldType;
}
