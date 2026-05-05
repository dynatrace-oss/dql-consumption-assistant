import { useFilteredData } from '@dynatrace/strato-components-preview/tables';
import { isNull } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import type { FilterItemValues } from '@dynatrace/strato-components-preview/filters';
import type { ResultRecord } from '@dynatrace-sdk/client-query';

/**
 * @returns FilterBar Related state and functions
 */

function useSearchBarHook<T>({ data }: { data: T[] }) {
  // To pass data table
  const [searchInput, setSearchInput] = useState('');

  // Remove Null records
  const modifiedQueryRecords = useMemo(() => data.filter((eachRecord) => !isNull(eachRecord)), [data]);

  // filter function
  const filterFn = useCallback((filters: FilterItemValues, entry: ResultRecord): boolean => {
    return Object.keys(filters).every((filterName) =>
      (Object.values(entry) as string[])
        .join()
        .toLowerCase()
        .includes((filters[filterName].value as string).toLowerCase()),
    );
  }, []);

  const { onChange: onFilterChange, filteredData } = useFilteredData(
    modifiedQueryRecords as unknown as ResultRecord[],
    filterFn,
  );

  return { filteredData, onFilterChange, searchInput, setSearchInput };
}

export default useSearchBarHook;
