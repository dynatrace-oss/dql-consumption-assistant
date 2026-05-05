import { useState, useCallback, useEffect } from "react";
import { filterData } from "../components/filters/FilterFieldHelpers";
import { generateFilterFieldValuesSuggestions } from "../components/filters/FilterSuggestions";
import type {
  FilterFieldTree,
  FilterFieldValidatorMap,
} from "@dynatrace/strato-components/filters";

/**
 * @returns FilterField Related state and functions
 */
function useFilteredSuggestions<T>({
  data,
  isDataLoading,
}: {
  data: T[];
  isDataLoading: boolean;
}) {
  const [value, setValue] = useState("");
  const [tree, setTree] = useState<FilterFieldTree>();
  const [submittedValue, setSubmittedValue] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>([]);

  /**
   * Generates Value Suggestions
   */
  const suggestions = generateFilterFieldValuesSuggestions(data);

  const validatorMap: FilterFieldValidatorMap = {
    keyPredicates: suggestions,
  };

  /** Update the Filter Data after fetching completes */
  useEffect(() => {
    if (!isDataLoading) {
      setFilteredData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoading]);

  /** Onchange Handler */
  const onChange = useCallback((val: string, treeVal?: FilterFieldTree) => {
    setValue(val);
    setTree(treeVal);
  }, []);

  /** Callback that fires on click of `Enter` or `Update Button` */
  const onSubmit = useCallback(() => {
    setSubmittedValue(value);
    setFilteredData(filterData(data, tree));
  }, [value, data, tree]);

  return {
    value,
    setValue,
    tree,
    setTree,
    submittedValue,
    filteredData,
    onChange,
    onSubmit,
    validatorMap,
  };
}

export default useFilteredSuggestions;
