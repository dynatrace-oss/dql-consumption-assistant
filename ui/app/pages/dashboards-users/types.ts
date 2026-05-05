import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface DashboardsUsersResultType extends CommonFieldsForInsights {
  'Dashboard ID': InsightFieldType;
  'Dashboard Name': InsightFieldType;
  'User': InsightFieldType;
}
