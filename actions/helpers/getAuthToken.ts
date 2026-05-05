import { SSO_URL } from './constants';
import type { SettingsSchemaType } from '../../ui/app/interfaces/Interfaces';

/**
 * Authenticate with SSO and return an access token
 */
export async function authenticate(oauthUrl: string, clientId: string, clientSecret: string, resource: string) {
  const grantType = 'client_credentials';
  const scope = 'account-idm-read account-idm-write';

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', grantType);
  urlencoded.append('client_id', clientId);
  urlencoded.append('client_secret', clientSecret);
  urlencoded.append('scope', scope);
  urlencoded.append('resource', resource);

  const response = await fetch(oauthUrl, {
    method: 'POST',
    redirect: 'follow',
    cache: 'no-cache',
    headers: myHeaders,
    body: urlencoded,
  });

  if (!response.ok) {
    throw new Error(`Failed to authenticate: ${response.statusText}`);
  }

  const responseJson: unknown = await response.json();

  if (responseJson && typeof responseJson === 'object' && 'access_token' in responseJson) {
    return (responseJson as { access_token: string }).access_token;
  }

  throw new Error('Authenticate response does not contain an access_token');
}

export async function getAuthToken(settingsValue: SettingsSchemaType): Promise<string> {
  const oauthUrl = SSO_URL;
  if (!settingsValue.client_id) {
    throw new Error("Input field 'client id' is missing.");
  }
  if (!settingsValue.client_secret) {
    throw new Error("Input field 'client secret' is missing.");
  }
  if (!settingsValue.account_id) {
    throw new Error("Input field 'account id' is missing.");
  }

  const resource = `urn:dtaccount:${settingsValue.account_id}`;

  // Fresh token each time : TODO - consider caching
  return authenticate(oauthUrl, settingsValue.client_id, settingsValue.client_secret, resource);
}
