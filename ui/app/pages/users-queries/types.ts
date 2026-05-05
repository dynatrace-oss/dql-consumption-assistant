import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface UsersQueriesResultType extends CommonFieldsForInsights {
  'App ID': InsightFieldType;
  'Query': InsightFieldType;
  'User': InsightFieldType;
}
