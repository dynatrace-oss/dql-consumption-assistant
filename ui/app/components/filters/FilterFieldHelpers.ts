import {
  isFilterFieldLeafNode,
  isFilterFieldListNode,
} from "@dynatrace/strato-components-preview/filters";
import { toSafeString } from "../../utils/helpers";
import type {
  FilterFieldGroupNode,
  FilterFieldLeafNode,
  FilterFieldNode,
  FilterFieldTree,
} from "@dynatrace/strato-components-preview/filters";
import type {
  ResultRecordValue,
  ResultRecord,
} from "@dynatrace-sdk/client-query";

export function getByPath(obj: object | undefined, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function filterData<T>(dataset: T[], node?: FilterFieldTree) {
  if (!node || dataset.length === 0) {
    return dataset;
  }
  return dataset.filter((item) => filterFunction(item as ResultRecord, node));
}

function filterFunction(
  item: ResultRecord,
  node: FilterFieldGroupNode,
): boolean {
  const { logicalOperator, children } = node;
  return logicalOperator === "OR"
    ? children.some((childNode) => evaluateFilter(item, childNode, false))
    : children.every((childNode) => evaluateFilter(item, childNode, true));
}

const isValidStatementKey = (needleKey: string, item: ResultRecord) =>
  needleKey in item;

const isValidItemKey = (itemkey: ResultRecordValue | undefined) => {
  return itemkey !== undefined && itemkey !== null;
};

function evaluateFilter(
  item: ResultRecord,
  node: FilterFieldNode,
  defaultReturn: boolean,
): boolean {
  switch (node.type) {
    case "Group":
      return filterFunction(item, node);
    case "Statement": {
      const { key, comparisonOperator: operator, value } = node;

      switch (operator?.type) {
        case "ComparisonOperator": {
          if (!(key && operator && value && isFilterFieldLeafNode(value))) {
            return defaultReturn;
          }
          const { value: comparisonOperator } = operator;
          let { value: statementKey } = key;
          const { type: statementKeyType } = key;
          const { value: statementValue } = value;

          if (!statementValue) {
            return defaultReturn;
          }

          statementKey =
            statementKeyType === "JSONPath" ? key.root : statementKey;

          if (!isValidStatementKey(statementKey, item)) {
            return defaultReturn;
          }

          const itemKey = item[statementKey];

          switch (comparisonOperator) {
            /**
             * TEMP: As most of our filters are strings, it is safe to convert statementValue to string
             * for cases `=` & `!=`
             * for `cost, avg, total, onDemand` values, although the itemKey is string, but statementValue is behaving as number. Hence to match the equal comparison, making statementValue.toString()
             *
             * Ex: itemKey - "123", statementKey - 123
             *  "123" == 123 ==> true
             *  "123" === 123 ==> false (Bcoz of strict equality comparator)
             *
             * To match the comparison, making statementValue to string by using `toString() method`
             *  "123" === "123" ==> true and filter works
             *
             */
            case "=":
              return (
                isValidItemKey(itemKey) &&
                itemKey === toSafeString(statementValue)
              );
            case "!=":
              return (
                isValidItemKey(itemKey) &&
                itemKey !== toSafeString(statementValue)
              );

            case "<":
              return isValidItemKey(itemKey) && itemKey < statementValue;
            case "<=":
              return isValidItemKey(itemKey) && itemKey <= statementValue;
            case ">":
              return isValidItemKey(itemKey) && itemKey > statementValue;
            case ">=":
              return isValidItemKey(itemKey) && itemKey >= statementValue;
            case "contains":
              return (
                isValidItemKey(itemKey) &&
                typeof itemKey === "string" &&
                typeof statementValue === "string" &&
                itemKey.includes(statementValue)
              );
            case "not-contains":
              return (
                isValidItemKey(itemKey) &&
                typeof itemKey === "string" &&
                typeof statementValue === "string" &&
                !itemKey.includes(statementValue)
              );
            case "starts-with": {
              return (
                isValidItemKey(itemKey) &&
                typeof itemKey === "string" &&
                typeof statementValue === "string" &&
                itemKey.startsWith(statementValue)
              );
            }
            case "not-starts-with":
              return (
                isValidItemKey(itemKey) &&
                typeof itemKey === "string" &&
                typeof statementValue === "string" &&
                !itemKey.startsWith(statementValue)
              );
            case "ends-with":
              return (
                isValidItemKey(itemKey) &&
                typeof itemKey === "string" &&
                typeof statementValue === "string" &&
                itemKey.endsWith(statementValue)
              );
            case "not-ends-with":
              return (
                isValidItemKey(itemKey) &&
                typeof itemKey === "string" &&
                typeof statementValue === "string" &&
                !itemKey.endsWith(statementValue)
              );
            default:
              // In case a new comparison operator was added, it should be handled accordingly.
              console.warn(
                `Comparison operator '${comparisonOperator}' not handled.`,
              );
              return defaultReturn;
          }
        }
        case "InclusionOperator": {
          if (!(key && operator && value && isFilterFieldListNode(value))) {
            return defaultReturn;
          }
          const { value: comparisonOperator } = operator;
          const { value: statementKey } = key;

          if (!isValidStatementKey(statementKey, item)) {
            return defaultReturn;
          }
          const { value: listValues } = value;
          const values = listValues.map((entry) => entry.value);

          const statementValue = (item[statementKey] ?? {}) as
            | string
            | number
            | boolean
            | FilterFieldLeafNode[]
            | undefined;

          return comparisonOperator === "in"
            ? values.includes(statementValue)
            : !values.includes(statementValue);
        }
        case "ExistsOperator": {
          if (!(key && operator)) {
            return defaultReturn;
          }

          const { value: statementKey } = key;
          const { value: operatorValue } = operator;

          if (!isValidStatementKey(statementKey, item)) {
            return defaultReturn;
          }

          return operatorValue
            ? item[statementKey] !== undefined
            : item[statementKey] === undefined;
        }
        case "SearchOperator": {
          if (!(value && isFilterFieldLeafNode(value))) {
            return defaultReturn;
          }
          const { value: statementValue } = value;
          if (!statementValue) {
            return defaultReturn;
          }
          return Object.values(item).some(
            (itemValue) =>
              typeof itemValue === "string" &&
              itemValue.includes(toSafeString(statementValue)),
          );
        }
        case undefined:
          return defaultReturn;
        default:
          // In case a new operator was added, it should be handled accordingly.
          console.warn(`Comparison operator '${operator?.type}' not handled.`);
          return defaultReturn;
      }
    }
    default:
      // The only nodes we want to handle are groups and statements.
      // Any other nodes included in the tree (explicit logical operator) will be ignored.
      return defaultReturn;
  }
}
