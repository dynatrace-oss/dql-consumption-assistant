import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface TopQueriesQueryResultType extends CommonFieldsForInsights {
  'App ID': InsightFieldType;
  'App Function': InsightFieldType;
  'User': InsightFieldType;
  'Query': InsightFieldType;
}
