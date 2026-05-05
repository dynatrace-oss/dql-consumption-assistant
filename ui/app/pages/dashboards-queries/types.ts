import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface DashboardsQueriesResultType extends CommonFieldsForInsights {
  'Dashboard ID': InsightFieldType;
  'Dashboard Name': InsightFieldType;
  'Query': InsightFieldType;
  'User': InsightFieldType;
}
