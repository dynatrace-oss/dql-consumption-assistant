import { convertStringWithTwoDecimals, convertTimeStampIntoActualReadableData } from '../../ui/app/utils/helpers';
import { apiRequest } from './apiRequest';
import type { UserExceedingThresholdGroupInfo, AllGroupsOfUserResponse, UserGroupMappedResult } from './types';
import type { SettingsSchemaType } from '../../ui/app/interfaces/Interfaces';
import type { ResultRecord } from '@dynatrace-sdk/client-query';

const FALLBACK_GROUP = {
  group_name: '',
  uuid: '',
  threshold: 0,
};

/**
 * Processes raw query result records and filters only those where the query cost exceeds the given threshold.
 *
 * - Filters out records below the cost threshold.
 * - Maps the remaining records into a simplified structure:
 *   `{ App, query_cost, timestamp, User }`
 *
 * @param records Array of query result records (nullable).
 * @param threshold Minimum query cost to include in the results.
 * @returns Array of processed records exceeding the threshold.
 */
export function processQueryResults(records: (ResultRecord | null)[], threshold: number) {
  const userCostMap = new Map<string, { App: string; query_cost: number; timestamp: string; User: string }>();

  records.forEach((each) => {
    if (!each) return; // skip null records

    const queryCost = Number(convertStringWithTwoDecimals(each.billed_bytes as string));
    const user = String((each.user as string | number | boolean | null | undefined) ?? '');

    const existing = userCostMap.get(user);
    if (existing) {
      existing.query_cost += queryCost; // add cost if user already exists
    } else {
      userCostMap.set(user, {
        App: String((each.app as string | number | boolean | null | undefined) ?? ''),
        query_cost: queryCost,
        timestamp: convertTimeStampIntoActualReadableData(each.timestamp as string),
        User: user,
      });
    }
  });

  // filter all costs per user by global threshold
  return Array.from(userCostMap.values()).filter((item) => item.query_cost >= threshold);
}

// Fetch all groups a user belongs to. Returns: AllGroupsOfUserResponse with the user’s groups and metadata.
export async function getAllGroupsOfUser(url: string, token: string): Promise<AllGroupsOfUserResponse> {
  return apiRequest(url, 'GET', token);
}

// Finds the group with the *highest threshold exceeded* by the given user.
// Returns: the group whose threshold was exceeded and is the highest, or null if none were exceeded (if null fallback to global).
function findExceedingGroup(groups: UserExceedingThresholdGroupInfo[], userQueryCost: number) {
  return groups
    .filter((g) => userQueryCost >= g.threshold)
    .reduce<UserExceedingThresholdGroupInfo | null>(
      (highest, current) => (highest === null || current.threshold > highest.threshold ? current : highest),
      null,
    );
}

function roundUpTwoDecimals(value: number): number {
  return Math.ceil(value * 100) / 100;
}

// Maps a single user group data against thresholds (custom / global).
// Returns: UserGroupMappedResult (user metadata + group that set threshold), or null if the API response contained no data.
export function mapUserGroups(
  response: AllGroupsOfUserResponse | null,
  userQueryCost: number,
  settingsValue: SettingsSchemaType,
): UserGroupMappedResult | null {
  if (!response?.data) {
    return null;
  }

  const userGroups = response.data.groups ?? [];
  const customThresholds = settingsValue.custom_thresholds ?? []; // Custom group thresholds from settings (will have group_name and threshold))

  // Match user groups against custom thresholds.
  // For each group the user belongs to, check if there is a matching group in settings of custom threshold.
  // If a match exists, include that group’s details with its threshold.
  const matchedCustomGroups = userGroups
    .map((g) => {
      const match = customThresholds.find((c) => c.group_name === g.groupName);
      return match ? { group_name: g.groupName, uuid: g.uuid, threshold: match.threshold } : null;
    })
    .filter((g): g is UserExceedingThresholdGroupInfo => g !== null);

  // Find which group’s threshold was exceeded
  // -> If multiple thresholds are exceeded, pick the highest one the user qualifies for.
  // Example: UserCost = 6, Group A threshold = 5, Group B threshold = 7 → pick Group A.
  const exceedingGroup = findExceedingGroup(matchedCustomGroups, userQueryCost);

  // If no custom group exceeded, fall back to global threshold
  const finalGroup = exceedingGroup ?? {
    ...FALLBACK_GROUP,
    threshold: settingsValue.global_threshold ?? FALLBACK_GROUP.threshold,
  };

  return {
    set_by: finalGroup, // exceeding group info (or global fallback)
    cost: roundUpTwoDecimals(userQueryCost), // How much this user consumed
    user_email: response.data.email,
    user_uuid: response.data.uid,
  };
}
