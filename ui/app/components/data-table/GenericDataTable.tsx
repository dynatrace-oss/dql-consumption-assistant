import { Button } from '@dynatrace/strato-components/buttons';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Tooltip } from '@dynatrace/strato-components-preview/overlays';
import { DataTable, type DataTableRef } from '@dynatrace/strato-components-preview/tables';
import { WrapTextIcon, WrapTextOffIcon } from '@dynatrace/strato-icons';
import { isUndefined } from 'lodash-es';
import React, { type ReactElement, useEffect, useRef, useState } from 'react';
import useFilteredSuggestions from '../../hooks/useFilteredSuggestions';
import useSearchBarHook from '../../hooks/useSearchBarHook';
import { ErrorBoundaryWithDqlQueryFailure } from '../error-boundary/ErrorBoundaryFallbacks';
import FilterBarComponent from '../filters/FilterBarComponent';
import FilterFieldComponent from '../filters/FilterFieldComponent';
import DataTableColumnSettings from './DatatableColumnSettings';
import DataTableDownloadButton from './DatatableDownloadButton';
import type { DataTableColumnDefinition } from '../../interfaces/Interfaces';

/** Minimum No.of characters user should input in search bar */
const SEARCH_BAR_MINIMUM_LENGTH = 3;

type RESET_SEARCH_AND_FILTER = 'NONE';

type SEARCH_BEHAVIOURS =
  | 'SEARCH' // just a normal search
  | 'SEARCH_THEN_FILTER' // searches and then filters
  | 'SEARCH_THEN_FILTER_WITH_COMPLEX' // searches and add complex filters
  | 'SEARCH_THEN_FILTER_AND_CLEAR_FILTER'; // searched and filtered and cleared the filter

type FILTER_BEHAVIOURS =
  | 'FILTER' // just a normal filter
  | 'COMPLEX_FILTERING' // filter with having AND, OR
  | 'COMPLEX_FILTERING_THEN_SEARCH' // filter having AND/OR and then performs search
  | 'FILTER_THEN_SEARCH' // normal filter and search
  | 'FILTER_THEN_SEARCH_AND_CLEAR_SEARCH'; // filtered and searched and cleared the seach

type FILTERS_MODE = RESET_SEARCH_AND_FILTER | SEARCH_BEHAVIOURS | FILTER_BEHAVIOURS;

interface GenericDataTableProps<T> {
  data: T[];
  isLoading: boolean;
  columns: DataTableColumnDefinition<T>[];
  isThereRowActions?: boolean;
  rowActionsJsx?: (rowData: T) => ReactElement;
  isThereExpandableRows?: boolean;
  expandableRowsJsx?: (rowData: T) => ReactElement;
  defaultColumnVisibility?: Record<string, boolean>;
}

/** Generic DataTable Component */
const GenericDataTable = <T,>({
  data,
  isLoading,
  columns,
  rowActionsJsx,
  isThereRowActions,
  isThereExpandableRows,
  expandableRowsJsx,
  defaultColumnVisibility,
}: GenericDataTableProps<T>) => {
  const dataTableRef = useRef<DataTableRef>(null);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(defaultColumnVisibility ?? {});
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((col) => col.id));
  const [enableLineWrap, setEnableLineWrap] = useState<boolean | Record<string, boolean>>(false);
  const [tableData, setTableData] = useState<T[]>([]);
  const [tempSearchData, setTempSearchData] = useState<T[]>([]);

  const [currentUserMode, setCurrentUserMode] = useState<FILTERS_MODE>('NONE');
  const [isFiltersLoading, setIsFiltersLoading] = useState(false);

  /** Filter/Search Bar Hook */
  const search = useSearchBarHook({ data: tableData });

  /** Filter Field Hook */
  const filter = useFilteredSuggestions({ data: tableData, isDataLoading: isLoading });

  /**
   * -- Use for debugging
   * console.log({ data: tableData.length });
     console.log({
       sI: search.searchInput,
       sT: tempSearchData.length,
       fs: filter.submittedValue,
       fTemp: tempFilterData.length,
       fTree: filter.tree,
    *  console.warn(currentUserMode);
  });
   */

  /**
   * @returns Filtered Data to pass to table
   */
  const resolveTableData = (): T[] => {
    switch (currentUserMode) {
      case 'SEARCH':
        return search.filteredData as T[];
      case 'SEARCH_THEN_FILTER':
        return filter.filteredData;
      case 'SEARCH_THEN_FILTER_WITH_COMPLEX':
        return filter.filteredData;
      case 'SEARCH_THEN_FILTER_AND_CLEAR_FILTER':
        return tempSearchData;
      case 'FILTER':
        return filter.filteredData;
      case 'COMPLEX_FILTERING':
        return filter.filteredData;
      case 'COMPLEX_FILTERING_THEN_SEARCH':
        return search.filteredData as T[];
      case 'FILTER_THEN_SEARCH':
        return search.filteredData as T[];
      case 'FILTER_THEN_SEARCH_AND_CLEAR_SEARCH':
        return filter.filteredData;
      case 'NONE':
      default:
        return data;
    }
  };

  const isSearchActive = search.searchInput.length >= SEARCH_BAR_MINIMUM_LENGTH;
  const isFilterActive = filter.submittedValue.length > 0;
  const isComplexFiltering = filter.submittedValue.includes('OR') || filter.submittedValue.includes('AND');

  /** Effect Used to Reset filter states */
  useEffect(() => {
    if (!isSearchActive && !isFilterActive) {
      setCurrentUserMode('NONE');
      setTempSearchData([]);
    }
  }, [isSearchActive, isFilterActive]);

  /** Effect Used for Search Conditions */
  useEffect(() => {
    if (isSearchActive && !isFilterActive && tempSearchData.length === 0) {
      setCurrentUserMode('SEARCH');
    } else if (
      isSearchActive &&
      isFilterActive &&
      !isComplexFiltering &&
      (currentUserMode === 'SEARCH' || currentUserMode === 'SEARCH_THEN_FILTER_AND_CLEAR_FILTER')
    ) {
      setCurrentUserMode('SEARCH_THEN_FILTER');
    } else if (isSearchActive && isFilterActive && isComplexFiltering) {
      setCurrentUserMode('SEARCH_THEN_FILTER_WITH_COMPLEX');
    } else if (isSearchActive && !isFilterActive && tempSearchData.length !== 0) {
      setCurrentUserMode('SEARCH_THEN_FILTER_AND_CLEAR_FILTER');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchActive, filter.submittedValue.length]);

  /** Effect Used for Filtering Conditions */
  useEffect(() => {
    if (isFilterActive && !isSearchActive && !isComplexFiltering) {
      setCurrentUserMode('FILTER');
    } else if (isFilterActive && isSearchActive && currentUserMode === 'FILTER') {
      setCurrentUserMode('FILTER_THEN_SEARCH');
    } else if (isFilterActive && isComplexFiltering && currentUserMode === 'FILTER') {
      setCurrentUserMode('COMPLEX_FILTERING');
    } else if (
      isFilterActive &&
      isComplexFiltering &&
      (currentUserMode === 'COMPLEX_FILTERING' || currentUserMode === 'FILTER_THEN_SEARCH_AND_CLEAR_SEARCH') &&
      isSearchActive
    ) {
      setCurrentUserMode('COMPLEX_FILTERING_THEN_SEARCH');
    } else if (
      isFilterActive &&
      !isSearchActive &&
      (currentUserMode === 'FILTER' || currentUserMode === 'COMPLEX_FILTERING_THEN_SEARCH')
    ) {
      setCurrentUserMode('FILTER_THEN_SEARCH_AND_CLEAR_SEARCH');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchActive, filter.submittedValue.length]);

  /** Effect Used to Update the Data in UI by using other state variables and functions */
  useEffect(() => {
    if (isLoading) return;

    setIsFiltersLoading(true);

    const resolved = resolveTableData();
    const timeout = setTimeout(() => {
      setTableData(resolved);
      setIsFiltersLoading(false);
    }, 2000);

    // optional: temp storage only when needed
    if (currentUserMode === 'SEARCH') setTempSearchData(resolved);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserMode, isLoading]);

  /** Disabling Table actions, if the query is either loading or, query returns no data */
  const disableTableActions = isLoading || data.length === 0;

  return (
    <Flex flexDirection='column'>
      {/* Table Actions */}
      <Flex flexDirection='row' minHeight='40px' alignItems='flex-end' justifyContent='space-between'>
        <Flex flex={2} alignItems='end' justifyContent='flex-start'>
          <Flex flexItem>
            <FilterBarComponent
              {...search}
              placeholderText={`Enter ${SEARCH_BAR_MINIMUM_LENGTH} or more characters`}
              disabled={disableTableActions}
            />
          </Flex>
          <Flex flexItem width='100%'>
            <FilterFieldComponent {...filter} isDataLoading={isLoading} disabled={disableTableActions} />
          </Flex>
        </Flex>
        <Flex flex={1} justifyContent='flex-end'>
          {/* Column Visibility Settings */}
          <Flex flexItem>
            <DataTableColumnSettings ref={dataTableRef} disabled={disableTableActions} />
          </Flex>

          {/* Line Wrap */}
          <Flex flexItem>
            <Tooltip text='Line Wrap' placement='top'>
              <Button
                onClick={() => {
                  setEnableLineWrap((prev) => !prev);
                }}
                variant='emphasized'
                disabled={disableTableActions}
              >
                <Button.Prefix>{enableLineWrap ? <WrapTextOffIcon /> : <WrapTextIcon />}</Button.Prefix>
              </Button>
            </Tooltip>
          </Flex>

          <Flex flexItem>
            <DataTableDownloadButton ref={dataTableRef} disabled={disableTableActions} />
          </Flex>
        </Flex>
      </Flex>
      {/* GenericDataTable  */}
      <Flex>
        <ErrorBoundaryWithDqlQueryFailure>
          <DataTable
            ref={dataTableRef}
            columns={columns}
            data={tableData}
            fullWidth
            resizable
            sortable
            loading={isLoading || isFiltersLoading}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={(newVisibility) => {
              setColumnVisibility(newVisibility);
            }}
            columnOrdering
            columnOrder={columnOrder}
            onColumnOrderChange={(newOrder) => {
              setColumnOrder(newOrder);
            }}
            variant={{
              rowDensity: 'comfortable',
              rowSeparation: 'zebraStripes',
              verticalDividers: true,
              contained: true,
            }}
            lineWrap={enableLineWrap}
            onLineWrapChange={(lineWrap) => {
              setEnableLineWrap(lineWrap);
            }}
          >
            {/* For Table Pagination */}
            <DataTable.Pagination
              defaultPageSize={10}
              defaultPageIndex={1}
            />

            {/* For Table Actions */}
            {!isUndefined(isThereRowActions) && !isUndefined(rowActionsJsx) && (
              <DataTable.RowActions>{(row: T) => rowActionsJsx(row)}</DataTable.RowActions>
            )}

            {/* For Expandable rows. */}
            {!isUndefined(isThereExpandableRows) && !isUndefined(expandableRowsJsx) && (
              <DataTable.ExpandableRow>{({ row }: { row: T }) => expandableRowsJsx(row)}</DataTable.ExpandableRow>
            )}
          </DataTable>
        </ErrorBoundaryWithDqlQueryFailure>
      </Flex>
    </Flex>
  );
};

export default GenericDataTable;
