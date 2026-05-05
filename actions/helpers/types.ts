import type { GROUP_EVENT } from './constants';

export interface ApiResponse<T> {
  status: number;
  ok: boolean;
  data: T | null;
}

/** Types for Cooldown Group Action */
interface UserGroupMembers {
  uid: string;
  email: string;
  name: string;
  surname: string;
  emergencyContact: boolean | string;
  userStatus: string;
  type: string;
}

export interface UserGroupMembersResponse {
  count: number;
  items: UserGroupMembers[];
}

type SingleAccountGroupResponse = {
  uuid: string;
  name: string;
  owner: string;
  description: string | null;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
};
export interface AccountUserGroupResponse {
  count: number;
  items: SingleAccountGroupResponse[];
}

/** Types for Consumption Stateful Action */
export type TokenResult = {
  requestToken: string;
};

export type ExecuteDqlQueryInput = {
  query: string;
};

export type UserExceedingThresholdGroupInfo = {
  group_name: string;
  uuid: string;
  threshold: number;
};

export type UserGroupMappedResult = {
  set_by: UserExceedingThresholdGroupInfo;
  cost: number;
  user_email: string;
  user_uuid: string;
};

type UserGroup = {
  groupName: string;
  uuid: string;
  owner: string;
  description: string;
  hidden: boolean;
  accountUUID: string;
  accountName: string;
  createdAt: string;
  updatedAt: string;
};

type UserDataWithGroup = {
  uid: string;
  email: string;
  name: string;
  surname: string;
  groups: UserGroup[];
  emergencyContact: boolean;
  userStatus: string;
};

export type AllGroupsOfUserResponse = {
  status: number;
  ok: boolean;
  data: UserDataWithGroup | null;
};

/** Types for When passing event type as payload and getting query and group based on that */
export type EventTypeKey = keyof typeof GROUP_EVENT; // "logs" | "events" | "traces"
export type EventGroupKey = (typeof GROUP_EVENT)[EventTypeKey]; // "logs_cooldown_group" | "events_cooldown_group" | "traces_cooldown_group"
