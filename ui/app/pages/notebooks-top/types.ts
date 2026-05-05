import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface TopNotebooksQueryResultType extends CommonFieldsForInsights {
  'Notebook Name': InsightFieldType;
  'Notebook ID': InsightFieldType;
}
