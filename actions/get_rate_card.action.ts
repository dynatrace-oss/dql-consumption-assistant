import { functions } from '@dynatrace-sdk/app-utils';
import { UnsuccessfulActionError, userLogger } from '@dynatrace-sdk/automation-action-utils/actions';
import { SETTINGS_SCHEMA_ID } from '../ui/app/constants/constants';
import { defaultRateCard } from '../ui/app/constants/Default_RateCard';
import type { RateCardResponse, GetSettingsValuesAppFunctionResponse } from '../ui/app/interfaces/Interfaces';

export default async (): Promise<RateCardResponse[]> => {
  // invoke app function
  const response = await functions.call(SETTINGS_SCHEMA_ID);
  const functionResponse = (await response.json()) as GetSettingsValuesAppFunctionResponse;

  if (functionResponse.error) {
    throw new UnsuccessfulActionError(functionResponse.error);
  }

  /**
   * If RateCard is just [], then use default rate.
   * Only trial/dev/sprint tenants, we get rate card as [], for others(like customers) it will be present
   */
  if (!functionResponse.data || functionResponse.data.length === 0) {
    userLogger.warn('found empty account ratecard. Hence using default rate card');
    return defaultRateCard;
  }

  return functionResponse.data;
};
