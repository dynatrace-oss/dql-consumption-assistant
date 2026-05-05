import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface TopDashboardsQueryResultType extends CommonFieldsForInsights {
  'Dashboard Name': InsightFieldType;
  'Dashboard ID': InsightFieldType;
}
