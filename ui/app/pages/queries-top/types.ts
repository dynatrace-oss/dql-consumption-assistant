import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface TopQueriesVolumeResultType extends CommonFieldsForInsights {
  'Timestamp': InsightFieldType;
  'App ID': InsightFieldType;
  'Query': InsightFieldType;
  'User': InsightFieldType;
}
