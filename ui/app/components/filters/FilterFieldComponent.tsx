import { Button } from '@dynatrace/strato-components/buttons';
import { Flex, Grid } from '@dynatrace/strato-components/layouts';
import {
  FilterField,
  type FilterFieldValidatorMap,
  type FilterFieldTree,
} from '@dynatrace/strato-components-preview/filters';
import { FormField } from '@dynatrace/strato-components-preview/forms';
import { PlayIcon, RefreshIcon } from '@dynatrace/strato-icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { ErrorBoundaryWithRetry } from '../error-boundary/ErrorBoundaryFallbacks';
import { filterFieldAriaLabelMessage, refreshButtonLabelMessage, updateButtonLabelMessage } from './messages';

interface FilterFiledComponentProps {
  onSubmit: VoidFunction;
  value: string;
  submittedValue: string;
  onChange: (val: string, treeVal?: FilterFieldTree) => void;
  validatorMap: FilterFieldValidatorMap;
  isDataLoading: boolean;
  disabled: boolean;
}

const FilterFiledComponent: React.FC<FilterFiledComponentProps> = ({
  value,
  submittedValue,
  onChange,
  onSubmit,
  validatorMap,
  isDataLoading,
  disabled,
}) => {
  const intl = useIntl();

  const ariaLabel = intl.formatMessage(filterFieldAriaLabelMessage);
  const refreshButton = intl.formatMessage(refreshButtonLabelMessage);
  const updateButton = intl.formatMessage(updateButtonLabelMessage);

  return (
    <ErrorBoundaryWithRetry>
      <Flex flexDirection='column'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <FormField>
            <Grid gridTemplateColumns='1fr auto'>
              <FilterField
                aria-label={ariaLabel}
                autoSuggestions
                value={value}
                onChange={onChange}
                validatorMap={validatorMap}
                disabled={disabled}
              >
                <FilterField.Suggestions loading={isDataLoading} />
              </FilterField>
              <Button
                type='submit'
                disabled={disabled}
                variant={value !== submittedValue ? 'accent' : 'emphasized'}
                color={value !== submittedValue ? 'primary' : 'neutral'}
              >
                <Button.Prefix>{value === submittedValue ? <RefreshIcon /> : <PlayIcon />}</Button.Prefix>
                {value === submittedValue ? refreshButton : updateButton}
              </Button>
            </Grid>
          </FormField>
        </form>
      </Flex>
    </ErrorBoundaryWithRetry>
  );
};

export default FilterFiledComponent;
