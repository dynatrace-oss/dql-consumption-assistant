import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface TopUsersQueryResultType extends CommonFieldsForInsights {
  'App ID': InsightFieldType;
  'App Function': InsightFieldType;
  'User': InsightFieldType;
}
