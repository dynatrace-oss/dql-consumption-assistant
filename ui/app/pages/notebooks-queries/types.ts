import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface NotebooksQueriesResultType extends CommonFieldsForInsights {
  'Notebook Name': InsightFieldType;
  'Notebook ID': InsightFieldType;
  'Query': InsightFieldType;
  'User': InsightFieldType;
}
