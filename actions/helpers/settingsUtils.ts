import { SETTINGS_SCHEMA_ID } from '../../ui/app/constants/constants';
import { getSettingsData } from '../../ui/app/utils/helpers';
import { API_DEV_URL } from './constants';
import type { SettingsSchemaType } from '../../ui/app/interfaces/Interfaces';
import type { EffectiveAppSettingsValue } from '@dynatrace-sdk/client-app-settings-v2';

export async function getAppSettings(): Promise<SettingsSchemaType> {
  const fetchedSettings: EffectiveAppSettingsValue[] = await getSettingsData(SETTINGS_SCHEMA_ID);
  const settingsValue = fetchedSettings[0]?.value as SettingsSchemaType | undefined;

  if (!settingsValue) throw new Error('Settings value is missing or invalid');
  return settingsValue;
}

export function giveListAllMembersOfGroupUrl(accoundId: string, groupUuid: string) {
  return `${API_DEV_URL}/iam/v1/accounts/${accoundId}/groups/${groupUuid}/users`;
}

export function addMembersInGroupUrl(accoundId: string, email: string) {
  return `${API_DEV_URL}/iam/v1/accounts/${accoundId}/users/${email}`;
}

export function removeMembersInGroupUrl(accoundId: string, email: string, groupUUID: string) {
  return `${API_DEV_URL}/iam/v1/accounts/${accoundId}/users/${email}/groups?group-uuid=${groupUUID}`;
}

export function getAllGroupsOfAccountUrl(accoundId: string) {
  return `${API_DEV_URL}/iam/v1/accounts/${accoundId}/groups`;
}

export function getAllGroupsOfUserUrl(accoundId: string, email: string) {
  return `${API_DEV_URL}/iam/v1/accounts/${accoundId}/users/${email}`;
}
