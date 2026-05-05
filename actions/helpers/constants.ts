export const SSO_URL = 'https://sso.dynatrace.com/sso/oauth2/token';

export const API_DEV_URL = 'https://api.dynatrace.com';

export const initialTimeframeValue = {
  from: {
    absoluteDate: '2025-01-01T12:00:00Z',
    type: 'expression',
    value: 'now()-24h',
  },
  to: {
    absoluteDate: '2025-01-01T12:00:00Z',
    type: 'now',
    value: 'now',
  },
};

// event-types
export const GROUP_EVENT = {
  logs: 'logs_cooldown_group',
  events: 'events_cooldown_group',
  traces: 'traces_cooldown_group',
} as const;

export const QUERY_EVENT = {
  logs: 'Log Management & Analytics - Query',
  events: 'Events - Query',
  traces: 'Traces - Query',
} as const;
