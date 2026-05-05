import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface NotebooksUsersQueryResultType extends CommonFieldsForInsights {
  'Notebook Name': InsightFieldType;
  'Notebook ID': InsightFieldType;
  'User': InsightFieldType;
}
