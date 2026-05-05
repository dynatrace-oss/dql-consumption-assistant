/**
 * Helper functions used in app
 */

import { getEnvironmentUrl } from "@dynatrace-sdk/app-environment";
import { appSettingsObjectsClient } from "@dynatrace-sdk/client-app-settings-v2";
import { formatDate } from "@dynatrace-sdk/units";
import {
  APP_ID_BASE,
  RATE_CARD_SETTINGS_SCHEMA_ID,
  SETTINGS_APP_ID,
} from "../constants/appIds";
import type {
  QueryTimeFrameType,
  RateCardResponse,
  CommonFieldsForInsights,
} from "../interfaces/Interfaces";
import type { ResultRecord } from "@dynatrace-sdk/client-query";

export type DtTableType = "logs" | "spans" | "events" | (string & {});

interface GiveCosBasedOnCapabilityAndTabletParamsType {
  isTableFrom: DtTableType;
  onDemandExecutions: string;
  rateCard: RateCardResponse[];
}

/**
 * eg: 2.34343 -> 2.34 and 2.00 -> 2
 */
export const convertStringWithTwoDecimals = (value?: string): string => {
  return parseFloat(parseFloat(value ?? "").toFixed(2)).toString();
};

export const timeframeConverterBasedOnType = (
  selectedTimeframe: QueryTimeFrameType,
) => {
  // Explanation:
  /**
   * Case 1: if user selects, values like Last 7 days or something like this, this is called `expression`
   *         For Expressions, we should query data `without` double quotes
   *         Ex: fetch logs, from: now()-7d, to: now()
   *
   * Case 2: if user selects, values from the date selector, this is called `iso` format
   *         For iso format, we should query data `with` using double quotes
   *         Ex: fetch logs, from: "2025-01-05T00:00:00.000Z", to: "2025-01-15T23:59:59.999Z"
   */

  if (selectedTimeframe.from.type === "expression") {
    return `from: ${selectedTimeframe.from.value}, to: ${selectedTimeframe.to.value}`;
  } else {
    return `from: "${selectedTimeframe.from.value}", to: "${selectedTimeframe.to.value}"`;
  }
};

// will return date, based on days passed
export const getDateXDaysAgo = (days: number) => {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
};

// will return, current time minus 24 hours back
export function getTime24HoursAgo() {
  const now = new Date();
  now.setHours(now.getHours() - 24);
  return now.toISOString();
}

/**
 * converts from "2025-03-18T09:59:12.977000000Z" to "3:25pm, March 18 2025"
 */
export function convertTimeStampIntoActualReadableData(date: string) {
  const newDate = new Date(date);

  const dateAndMonthAndYear = formatDate(newDate, { dateStyle: "medium" });
  const time = formatDate(newDate, { hour: "numeric", minute: "numeric" });

  return `${time}, ${dateAndMonthAndYear}`;
}

/**
 * Add Commas to big numbers
 * e.g, 340021 to 3,40,021
 */
export function addCommasToBigNumbers(val: string) {
  const toNumVal = Number(val);

  return new Intl.NumberFormat("en-US").format(toNumVal);
}

// gives meaningfull error messages
export const giveMeaningFullErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred";
};

/**
 *
 * @param schemas
 * @returns list of settings items
 */
export const getSettingsData = async (schemas: string) => {
  try {
    const data = await appSettingsObjectsClient.getEffectiveAppSettingsValues({
      schemaId: schemas,
    });
    return data.items;
  } catch {
    console.error("Failed to load settings");
    throw new Error("Failed to load settings");
  }
};

/**
 *
 * @param rateCardResponse[]
 * @returns validated ratecard that checks the current time between quoted startTime & endTime
 */

export const findValidRateCard = (
  rateCardResponse: RateCardResponse[],
): RateCardResponse => {
  let validRateCard: RateCardResponse = {
    quoteNumber: "",
    currencyCode: "",
    startTime: "",
    endTime: "",
    capabilities: [],
  };

  let foundValidCard = false;
  const today = new Date().getTime();

  for (const rateCard of rateCardResponse) {
    const start = Date.parse(rateCard.startTime);
    const end = Date.parse(rateCard.endTime);

    if (start <= today && today <= end) {
      foundValidCard = true;
      validRateCard = rateCard;
    }
  }

  if (!foundValidCard && rateCardResponse.length > 0 && rateCardResponse[0]) {
    // defaults to the first rate card in the response if the timeframe can't be validated
    validRateCard = rateCardResponse[0];
  }

  return validRateCard;
};

/**
 *
 * @param rateCard
 * @param eventName
 * @returns price of latest ratecard of given type
 */
export const getPriceOfGivenEventName = (
  rateCard: RateCardResponse[],
  eventName: string,
) => {
  const validRateCard = findValidRateCard(rateCard);

  const capability = validRateCard.capabilities.filter(
    (eachCapability) =>
      eachCapability.name === eventName || eachCapability.key === eventName,
  )[0];
  return capability.price;
};

/**
 * This utility helps in navigating to correct app.
 * From DQL, sometimes we get appNames in other ways
 * eg. 'dynatrace.classic.log-events' instead of 'dynatrace.classic.logs.events'
 * So This helper function, updates and gives correct appId
 */

interface UnClassifiedAppsType {
  id: number;
  oldAppId: string;
  newAppId: string;
}

export const giveApplicationUrlBasedOnAppNameFromQueryResult = (
  appId: string,
) => {
  const tenantUrl = getEnvironmentUrl();

  // We can add other app Id's if we came to know about it later.
  const UnClassifiedApps: UnClassifiedAppsType[] = [
    {
      id: 1,
      oldAppId: "dynatrace.classic.log-events",
      newAppId: "dynatrace.classic.logs.events",
    },
    {
      id: 2,
      oldAppId: "dynatrace.classic.dashboard-log-tile",
      newAppId: "dynatrace.classic.dashboards",
    },
  ];

  const updatedAppId =
    UnClassifiedApps.find((eachApp) => eachApp.oldAppId === appId)?.newAppId ??
    appId;

  return `${tenantUrl}/ui/apps/${updatedAppId}`;
};

export const giveRateCardSettingsLink = () => {
  // Example URL
  // https://{tenantId}.apps.dynatrace.com/ui/apps/dynatrace.classic.settings/ui/settings/app:{appId}:{settings-schema-id}
  const appUrl =
    giveApplicationUrlBasedOnAppNameFromQueryResult(SETTINGS_APP_ID);
  return `${appUrl}/ui/settings/app:${APP_ID_BASE}:${RATE_CARD_SETTINGS_SCHEMA_ID}`;
};

// Remove version from Workflow title (e.g., "DQL Consumption (v1.2.3)" -> "DQL Consumption")
export const removeVersion = (str = "") =>
  str
    .replace(/\(v[^)]+\)/i, "")
    .trim()
    .toLowerCase();

// Get version from Workflow title (e.g., "DQL Consumption (v1.2.3)" -> "(v1.2.3)")
export const getVersion = (str = "") => {
  const match = /\(v[\d.]+\)/i.exec(str); // e.g., "(v1.2.5)"
  return match ? match[0].replace(/[()]/g, "").trim() : null; // remove parentheses and trim
};

/**
 * See VAST-345 comments for more information
 */

export function giveCostBasedOnCapabilityAndTable({
  isTableFrom,
  onDemandExecutions,
  rateCard,
}: GiveCosBasedOnCapabilityAndTabletParamsType): string {
  const LogsCapabilityType = "Log Management & Analytics - Query";
  const SpansCapabilityType = "Traces - Query";
  const EventsCapabilityType = "Events - Query";
  let eventCost = "0";

  if (isTableFrom === "logs") {
    /** If Table value is logs, then use Logs Managment Capability */
    eventCost = getPriceOfGivenEventName(rateCard, LogsCapabilityType);
  } else if (isTableFrom === "spans") {
    /** If Table value is spans, then use Traces Capability */
    eventCost = getPriceOfGivenEventName(rateCard, SpansCapabilityType);
  } else {
    /** Anything other than logs & spans, then use Events Query */
    if (isTableFrom.includes("events")) {
      eventCost = getPriceOfGivenEventName(rateCard, EventsCapabilityType);
    }
  }

  const price = Number(eventCost) * Number(onDemandExecutions);

  return price.toFixed(2);
}

/**
 * Converts ResultRecordValue to string
 */
// eslint-disable-next-line @typescript-eslint/no-base-to-string
export const toSafeString = (val: unknown) => (val === null ? "" : String(val));

/**
 * Extracts Common Fields Data
 * Will be using in all insight pages
 */
export const giveInsightsCommonFieldsExtractedData = (
  eachRecord: ResultRecord | null,
  rateCard: RateCardResponse[],
): CommonFieldsForInsights => {
  const noValue = "N/A";
  return {
    Bucket: eachRecord?.bucket as string,
    Executions: toSafeString(eachRecord?.num_executions ?? noValue),

    "Average GiB": convertStringWithTwoDecimals(
      (eachRecord?.avg_scanned as string) ?? noValue,
    ),

    "Total GiB": convertStringWithTwoDecimals(
      (eachRecord?.total_scanned as string) ?? noValue,
    ),
    "Included GiB": toSafeString(eachRecord?.scanned_included ?? noValue),
    "On Demand GiB": toSafeString(eachRecord?.scanned_on_demand ?? noValue),
    Table: toSafeString(eachRecord?.table ?? noValue),
    Cost: giveCostBasedOnCapabilityAndTable({
      isTableFrom: eachRecord?.table as DtTableType,
      onDemandExecutions: eachRecord?.scanned_on_demand as string,
      rateCard: rateCard,
    }),
  };
};
