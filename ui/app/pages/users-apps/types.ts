import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface UsersAppsResultType extends CommonFieldsForInsights {
  'App ID': InsightFieldType;
  'User': InsightFieldType;
}
