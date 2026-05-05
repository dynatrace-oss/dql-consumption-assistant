import { type ResultRecord } from "@dynatrace-sdk/client-query";
import type {
  CommonFieldsForInsights,
  OtherFieldsForInsights,
} from "../../interfaces/Interfaces";
import type {
  FilterFieldComparisonOperators,
  FilterFieldValidatorMapTypePredicate,
  FilterFieldValuePredicate,
} from "@dynatrace/strato-components-preview/filters";

type SuggestionsTypeForValidatorMap = {
  [x: string]: {
    operators?: FilterFieldComparisonOperators[];
    valuePredicate: FilterFieldValuePredicate;
  };
};

type LabelType = keyof CommonFieldsForInsights | keyof OtherFieldsForInsights;

type FieldsType = {
  label: LabelType;
  operators?: FilterFieldComparisonOperators[];
  // eslint-disable-next-line @typescript-eslint/no-deprecated
} & FilterFieldValidatorMapTypePredicate;

/**
 * List of fields to extract unique string values from
 * type property will ensure specific comparison operator for keys
 * Here as table is having type:string, so this will not show operators like "<, <=, >, >=, etc..."
 */
const fields: FieldsType[] = [
  { label: "Table", type: "String" },
  { label: "Bucket", type: "String" },
  { label: "Executions", type: "Number" },
  { label: "Average GiB", type: "Number" },
  { label: "Total GiB", type: "Number" },
  { label: "Included GiB", type: "Number" },
  { label: "On Demand GiB", type: "Number" },
  { label: "Cost", type: "Number" },
  { label: "Dashboard ID", type: "String" },
  { label: "Notebook ID", type: "String" },
  { label: "User", type: "String" },
  { label: "App ID", type: "String" },
  { label: "App Function", type: "String" },
  { label: "Query", type: "String", operators: ["contains", "not-contains"] },
  {
    label: "Timestamp",
    type: "String",
    operators: ["contains", "not-contains"],
  },
];

/**
 * Takes Grail Query Result and returns the filter field suggestions
 */
export function generateFilterFieldValuesSuggestions<T>(
  records: T[],
): SuggestionsTypeForValidatorMap {
  // Helper to get unique string values for a field
  function getUniqueStringValues(field: string): string[] {
    const values = records.map((record) => {
      if (Object.hasOwn(record as ResultRecord, field)) {
        const value = record[field as keyof typeof record];
        return typeof value === "string" ? value : undefined;
      }
      return undefined;
    });

    return Array.from(new Set(values)).filter(
      (value) => typeof value === "string",
    );
  }

  const initialRecord = records[0];

  const result: SuggestionsTypeForValidatorMap = {};
  for (const { label, type, operators } of fields) {
    const values = getUniqueStringValues(label);
    /**
     * Explanation
     * Condition 1. if the record has the label, then only push the label into result obj
     * Condition 2. This is based on the scenario test. I've filtered data using filter field, and then intentionally searched for record that doesn't exist, then table shows 0 records as expected. But filter starts showing red because, initial record is undefined and if condition fails, so it says `Invalid filter key`
     */
    if (
      (initialRecord && Object.hasOwn(initialRecord, label)) ||
      records.length === 0
    ) {
      result[label] = {
        valuePredicate: [...values, { type }],
        operators,
      };
    }
  }

  return result;
}
