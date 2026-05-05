import type { CommonFieldsForInsights, InsightFieldType } from '../../interfaces/Interfaces';

export interface QueriesWithoutBestPracticeResultType extends CommonFieldsForInsights {
  'App ID': InsightFieldType;
  'User': InsightFieldType;
  'Query': InsightFieldType;
}
