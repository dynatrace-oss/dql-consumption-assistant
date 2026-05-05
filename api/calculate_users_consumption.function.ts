/* eslint-disable @typescript-eslint/no-unsafe-return */
import { runner } from '@dynatrace-sdk/automation-action-utils/actions';
import action from '../actions/calculate_users_consumption.stateful-action';

export default async function (payload: unknown = undefined) {
  return runner(null, payload, action, { stateful: true });
}
