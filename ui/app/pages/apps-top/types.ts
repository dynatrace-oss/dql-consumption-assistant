import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface TopAppsQueryResultType extends CommonFieldsForInsights {
  'App ID': InsightFieldType;
  'App Function': InsightFieldType;
}
