import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface TopUsersQueryResultType extends CommonFieldsForInsights {
  User: InsightFieldType;
}
