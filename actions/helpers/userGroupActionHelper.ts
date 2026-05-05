import { userLogger } from '@dynatrace-sdk/automation-action-utils/actions';
import { apiRequest } from './apiRequest';
import {
  addMembersInGroupUrl,
  getAllGroupsOfAccountUrl,
  giveListAllMembersOfGroupUrl,
  removeMembersInGroupUrl,
} from './settingsUtils';
import type { ApiResponse, AccountUserGroupResponse, UserGroupMembersResponse } from './types';

export type UserAction = 'added' | 'removed';
export type Result<T = unknown> = {
  user: string;
  action: UserAction;
  success: boolean;
  status?: T;
  error?: string;
};

async function getAccountGroupDetailsWithToken(url: string, token: string) {
  return apiRequest<AccountUserGroupResponse>(url, 'GET', token);
}

async function getGroupMemeberDetailsWithToken(url: string, token: string) {
  return apiRequest<UserGroupMembersResponse>(url, 'GET', token);
}

async function addUsersIntoGroupWithToken(url: string, token: string, groupUUIDs: string[]) {
  return apiRequest(url, 'POST', token, groupUUIDs);
}

async function removeUsersFromGroupWithToken(url: string, token: string) {
  return apiRequest(url, 'DELETE', token);
}

// ----Retrieve all groups for the account (to obtain the UUID of the cooldown group)----
export async function getCooldownGroupUuid(accountId: string, authToken: string, groupName: string): Promise<string> {
  if (!groupName.trim()) {
    throw new Error(`Input field ${groupName} is missing or empty.`);
  }

  const groupsUrl = getAllGroupsOfAccountUrl(accountId);
  const response: ApiResponse<AccountUserGroupResponse> = await getAccountGroupDetailsWithToken(groupsUrl, authToken);

  // Matching Cooldown group by name to get its UUID
  const matched = response.data?.items.find((item) => item.name === groupName);
  if (!matched) throw new Error(`Cooldown group '${groupName}' not found in the account.`);

  return matched.uuid;
}

// ---Get members of a group (emails only)---
export async function getGroupMemberEmails(accountId: string, groupUuid: string, authToken: string): Promise<string[]> {
  const url = giveListAllMembersOfGroupUrl(accountId, groupUuid);
  const response: ApiResponse<UserGroupMembersResponse> = await getGroupMemeberDetailsWithToken(url, authToken);

  return response.data ? response.data.items.map((m) => m.email) : [];
}

// --- Add users helper ---
async function processAddUsers(
  users: string[],
  accountId: string,
  groupUUID: string,
  authToken: string,
): Promise<Result[]> {
  const results: Result[] = [];

  for (const user of users) {
    const url = addMembersInGroupUrl(accountId, user);
    try {
      const res = await addUsersIntoGroupWithToken(url, authToken, [groupUUID]);
      userLogger.info(`Added user: ${user} -> with status ${res.status}`);
      results.push({ user, action: 'added', success: true, status: res.status });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      userLogger.error(`Failed to add user: ${user} → ${msg}`);
      results.push({ user, action: 'added', success: false, error: msg });
    }
  }

  return results;
}

// --- Remove users helper ---
async function processRemoveUsers(
  users: string[],
  accountId: string,
  groupUUID: string,
  authToken: string,
): Promise<Result[]> {
  const results: Result[] = [];

  for (const user of users) {
    const url = removeMembersInGroupUrl(accountId, user, groupUUID);
    try {
      const res = await removeUsersFromGroupWithToken(url, authToken);
      userLogger.info(`Removed user: ${user} -> with status ${res.status}`);
      results.push({ user, action: 'removed', success: true, status: res.status });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      userLogger.error(`Failed to remove user: ${user} → ${msg}`);
      results.push({ user, action: 'removed', success: false, error: msg });
    }
  }

  return results;
}

// ----Sync add/remove users from the cooldown group----
export async function syncGroupUsers(
  accountId: string,
  groupUuid: string,
  authToken: string,
  payloadUsers: string[],
  groupMembers: string[],
) {
  // - `usersToAdd`: in payload but not in group
  // - `usersToRemove`: in group but not in payload
  const usersToAdd = payloadUsers.filter((u) => !groupMembers.includes(u));
  const usersToRemove = groupMembers.filter((u) => !payloadUsers.includes(u));

  const addResults = await processAddUsers(usersToAdd, accountId, groupUuid, authToken);
  const removeResults = await processRemoveUsers(usersToRemove, accountId, groupUuid, authToken);

  return { addResults, removeResults };
}

// ----Merge final results (it merges API add/remove results with the original payload to produce a single list showing who was added, removed, or skipped)----
export function mergeResults(users: { user_email: string }[], addResults: Result[], removeResults: Result[]) {
  // Lookup maps for quick access by email
  const addMap = new Map<string, Result>(addResults.map((r) => [r.user.toLowerCase(), r]));
  const removeMap = new Map<string, Result>(removeResults.map((r) => [r.user.toLowerCase(), r]));

  // Build results for payload users
  // - If user was added -> mark as "added"
  // - Otherwise -> mark as "skipped"
  const finalResults = users.map((record) => {
    const userKey = record.user_email.toLowerCase();
    const added = addMap.get(userKey);

    if (added) {
      return { ...record, change: 'added', success: added.success, error: added.error };
    }
    return { ...record, change: 'skipped', success: true };
  });

  // Results for removed users: These users are not part of payload, so only api result details are available
  // Mark as "removed"
  const removedResults = Array.from(removeMap.values()).map((removed) => ({
    user_email: removed.user,
    change: 'removed',
    success: removed.success,
    error: removed.error,
  }));

  // Merge them and return
  return [...finalResults, ...removedResults];
}
