import {
  SETTINGS_SCHEMA_ID,
  SSO_URL,
  giveRateCardUrl,
} from "../ui/app/constants/constants";
import { defaultRateCard } from "../ui/app/constants/Default_RateCard";
import { getSettingsData } from "../ui/app/utils/helpers";
import type {
  GetSettingsValuesAppFunctionResponse,
  RateCardResponse,
  SettingsSchemaType,
} from "../ui/app/interfaces/Interfaces";

/**
 * Authenticate to SSO
 *
 * @param oauthUrl
 * @param clientId
 * @param clientSecret
 */
export async function authenticate(
  oauthUrl: string,
  clientId: string,
  clientSecret: string,
  resource: string,
) {
  const grantType = "client_credentials";
  const scope = "account-uac-read";

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", grantType);
  urlencoded.append("client_id", clientId);
  urlencoded.append("client_secret", clientSecret);
  urlencoded.append("scope", scope);
  urlencoded.append("resource", resource);

  const response = await fetch(oauthUrl, {
    method: "POST",
    redirect: "follow",
    cache: "no-cache",
    headers: myHeaders,
    body: urlencoded,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to authenticate: ${errorMessage}`);
  }

  const responseJson: unknown = await response.json();

  if (
    responseJson &&
    typeof responseJson === "object" &&
    "access_token" in responseJson
  ) {
    return responseJson.access_token;
  }

  throw new Error("Authenticate response does not contain an acces_token");
}

/**
 * Gives Rate Card values
 *
 * @param rateCardUrl
 * @param accessToken
 */
export async function getRateCardValuesWithToken(
  rateCardUrl: string,
  accessToken: string,
) {
  const rateCardHeaders = new Headers();
  rateCardHeaders.append("Authorization", "Bearer " + accessToken);

  const response = await fetch(rateCardUrl, {
    method: "GET",
    headers: rateCardHeaders,
    cache: "no-cache",
    redirect: "follow" as RequestRedirect,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch rate card values: ${errorMessage}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const responseJson: RateCardResponse[] = await response.json();
  return responseJson;
}

/**
 * Fetches Rate Card from Account Management
 * Authentication token is required to fetch rate card. After retreiving token pass this token to account management api
 */

export const fetchRateCardValuesFromAccountManagement = async ({
  settings,
}: {
  settings: SettingsSchemaType;
}) => {
  try {
    if (!settings.client_id) {
      throw new Error("Input field 'client id' is missing.");
    }

    if (!settings.client_secret) {
      throw new Error("Input field 'client secret' is missing.");
    }

    if (!settings.account_id) {
      throw new Error("Input field 'account id' is missing.");
    }

    // append the account_id with urn:dtaccount: , as authentication requires this
    const resource = `urn:dtaccount:${settings.account_id}`;
    const accessToken = await authenticate(
      SSO_URL,
      settings.client_id,
      settings.client_secret,
      resource,
    );

    // gives the ratecard url
    const url = giveRateCardUrl(settings.account_id);

    // take the url and auth_acces_token and pass to ratecard url
    const response = await getRateCardValuesWithToken(
      url,
      accessToken as string,
    );

    return { data: response };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error while fetching ratecard values";

    return {
      error: `Error while fetching ratecard values: ${message}`,
    };
  }
};

/**
 * App function to fetch the rate card values
 */
export default async function (): Promise<
  GetSettingsValuesAppFunctionResponse | undefined
> {
  const fetchedAppSettings = await getSettingsData(SETTINGS_SCHEMA_ID);

  if (
    fetchedAppSettings.length === 0 ||
    fetchedAppSettings[0]?.value?.rate_card_type === "default"
  ) {
    return { data: defaultRateCard };
  } else {
    const res = await fetchRateCardValuesFromAccountManagement({
      settings: fetchedAppSettings[0].value as SettingsSchemaType,
    });

    return res;
  }
}
