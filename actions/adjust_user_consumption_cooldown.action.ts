import { UnsuccessfulActionError, userLogger } from '@dynatrace-sdk/automation-action-utils/actions';
import { ConsumptionUserGroupSchema } from '../ui/app/services/types/workflowValidation';
import { giveMeaningFullErrorMessage } from '../ui/app/utils/helpers';
import { GROUP_EVENT } from './helpers/constants';
import { getAuthToken } from './helpers/getAuthToken';
import { getAppSettings } from './helpers/settingsUtils';
import {
  getCooldownGroupUuid,
  getGroupMemberEmails,
  mergeResults,
  syncGroupUsers,
} from './helpers/userGroupActionHelper';
import type { EventTypeKey } from './helpers/types';

export default async (rawPayload: unknown) => {
  const parsed = ConsumptionUserGroupSchema.safeParse(rawPayload);

  if (!parsed.success) {
    userLogger.error(JSON.stringify(parsed.error, null, 2));
    throw new UnsuccessfulActionError('Invalid payload. Check logs for details.');
  }

  const { eventType, users } = parsed.data;
  try {
    // EXAMPLE PAYLOAD (will be replaced with real incoming payload)
    // const users = [
    //   {
    //     cost: 0.35,
    //     set_by: {
    //       uuid: '',
    //       threshold: 0,
    //       group_name: '',
    //     },
    //     user_uuid: '75391f86-75cb-4027-a5ba-64c49e2c9a86',
    //     user_email: 'priya.pathak@dynatrace.com',
    //   },
    // {
    //   cost: 0.35,
    //   set_by: {
    //     group_name: 'DQL-test-Group',
    //     uuid: '2f947c20-b863-4d73-80ce-0f178e4e7ef5',
    //     threshold: 5,
    //   },
    //   user_uuid: 'c2dd99d0-a597-42ce-b935-83b8dec9903b',
    //   user_email: 'priyapathak.work@gmail.com',
    // },
    // ];

    // Get app settings (contains cooldown group name)
    const settingsValue = await getAppSettings();

    // Get auth token to call Account Management API
    const authToken = await getAuthToken(settingsValue);

    // dynamically resolve the right group key from settings
    const groupKey = GROUP_EVENT[eventType as EventTypeKey]; // e.g. "logs_cooldown_group"

    // const groupName = settingsValue.logs_cooldown_group ?? '';
    const groupName: string = settingsValue[groupKey] ?? '';

    const accountId = String(settingsValue.account_id);

    // if no cooldown group is configured, just return payload directly
    if (!groupName.trim()) {
      return users;
    }

    // Getting the cooldown group UUID by name present in app settings
    const cooldownGroupUuid = await getCooldownGroupUuid(accountId, authToken, groupName);

    // Fetch current group members (cooldown group members) - returns emails already present in the cooldown group
    const groupMembers = await getGroupMemberEmails(accountId, cooldownGroupUuid, authToken);

    // `payloadUsers`: emails coming from the request payload
    const payloadUsers = users.map((u) => u.user_email);

    // Sync group users: add/remove users from the group
    const { addResults, removeResults } = await syncGroupUsers(
      accountId,
      cooldownGroupUuid,
      authToken,
      payloadUsers,
      groupMembers,
    );

    // merges API add/remove results with the original payload to produce a single list with change tag
    return mergeResults(users, addResults, removeResults);
  } catch (error: unknown) {
    const message = giveMeaningFullErrorMessage(error);
    userLogger.error(message);
    throw new UnsuccessfulActionError(`Failed to add group members: ${message}`);
  }
};
