import { TimeframeSelector } from '@dynatrace/strato-components-preview/filters';
import { FormField, Label } from '@dynatrace/strato-components-preview/forms';
import { type ActionWidget } from '@dynatrace-sdk/automation-action-utils';
import { isEmpty } from 'lodash-es';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { initialTimeframeValue } from '../ui/app/context/timeframe-context/TimeframeInitialValue';
import { type QueryTimeFrameType } from '../ui/app/interfaces/Interfaces';

interface CalculateUsersConsumptionInput {
  timeframe: QueryTimeFrameType;
}

const CalculateUsersConsumptionWidget: ActionWidget<CalculateUsersConsumptionInput> = (props) => {
  const { value, onValueChanged } = props;

  const updateValue = (newValue: Partial<CalculateUsersConsumptionInput>) => {
    onValueChanged({ ...value, ...newValue });
  };

  useEffect(() => {
    if (isEmpty(value)) {
      updateValue({ timeframe: initialTimeframeValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <FormField>
      <Label>
        <FormattedMessage defaultMessage='Set Timeframe For Consumption Data' id='G7h+7Zk+coVJ6fEm' />
      </Label>
      <TimeframeSelector
        value={value.timeframe}
        onChange={(timeframe) => updateValue({ timeframe: timeframe as QueryTimeFrameType })}
        stepper={false}
      />
    </FormField>
  );
};

export default CalculateUsersConsumptionWidget;
