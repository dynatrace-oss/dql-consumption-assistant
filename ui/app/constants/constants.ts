/**
 * This file is for constants, that won't change
 */

import type { SortType } from "../interfaces/Interfaces";

// Update this when there is any change in workflow
export const WORKFLOW_VERSION = "v1.0.0";

export const SETTINGS_SCHEMA_ID = "get-settings-values";

// These are used in app-functions
// Took these url's from cross-charge-app
export const SSO_URL = "https://sso.dynatrace.com/sso/oauth2/token";

export function giveRateCardUrl(accoundId: string) {
  return `https://api.dynatrace.com/sub/v1/accounts/${accoundId}/rate-cards`;
}

// Sort Type for all columns
export const TABLE_SORT_TYPE_FOR_ALL_COLUMNS: SortType = "number";
