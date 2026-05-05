import { FilterBar, type FilterItemValues } from '@dynatrace/strato-components-preview/filters';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { MagnifyingGlassIcon, XmarkIcon } from '@dynatrace/strato-icons';
import React from 'react';
import { ErrorBoundaryWithRetry } from '../error-boundary/ErrorBoundaryFallbacks';

interface FilterBarComponentProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  onFilterChange: (appliedFilters: FilterItemValues) => void;
  placeholderText: string;
  disabled: boolean;
}

const FilterBarComponent: React.FC<FilterBarComponentProps> = ({
  onFilterChange,
  searchInput,
  setSearchInput,
  placeholderText,
  disabled,
}) => {
  /** For Updating Filter Bar */
  const handleFilter = (val: string) => {
    setSearchInput(val);
    onFilterChange({ filterItem: { value: val } });
  };

  /** Resets Filter Bar (TextInput & FilterValues) */
  const handleSearchReset = () => {
    setSearchInput('');
    onFilterChange({});
  };

  return (
    <ErrorBoundaryWithRetry>
      <FilterBar onFilterChange={() => {}} style={{ width: '100%' }}>
        <FilterBar.Item name='search-bar' label='Search'>
          <TextInput value={searchInput} onChange={handleFilter} placeholder={placeholderText} disabled={disabled}>
            <TextInput.Prefix>
              <MagnifyingGlassIcon />
            </TextInput.Prefix>
            <TextInput.Suffix>
              <TextInput.Button onClick={handleSearchReset}>
                <XmarkIcon />
              </TextInput.Button>
            </TextInput.Suffix>
          </TextInput>
        </FilterBar.Item>
      </FilterBar>
    </ErrorBoundaryWithRetry>
  );
};

export default FilterBarComponent;
