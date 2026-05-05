import { type Timeframe } from '@dynatrace/strato-components-preview/core';
import { TimeframeSelector } from '@dynatrace/strato-components-preview/filters';
import { parseTimeAsTimeValue } from '@dynatrace-sdk/units';
import { isNull } from 'lodash-es';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppTimeframeContext } from '../../../context/timeframe-context/TimeframeContext';
import { initialTimeframeValue } from '../../../context/timeframe-context/TimeframeInitialValue';

const TIMEFRAME_SEARCH_KEY = 'tf';

/**
 * Timeframe selector for changing the query time
 */

const PageTimeframeSelector: React.FC = () => {
  const { timeframe, setTimeFrame } = useAppTimeframeContext();
  const [params, setBrowserParamsTf] = useSearchParams();

  /**
   * 1. if tf is present then update the tf using useEffect
   * 2. if tf is not present then handleChange should update the timeframe & browser URL
   */
  const timeframeFromURL = params.get(TIMEFRAME_SEARCH_KEY);

  useEffect(() => {
    if (timeframeFromURL) {
      // Ex: tf=from=now-30m,to=now
      const tf = timeframeFromURL.split(',');
      const from = tf[0].split('=')[1]; // from value
      const to = tf[1].split('=')[1]; // to value

      // https://developer.dynatracelabs.com/develop/sdks/units/#parsetimeastimevalue
      const fromValue = parseTimeAsTimeValue(from);
      const toValue = parseTimeAsTimeValue(to);

      setTimeFrame({ from: fromValue!, to: toValue! }, false);
    } else {
      setTimeFrame(initialTimeframeValue, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframeFromURL]);

  const handleTimeChange = (val: Timeframe | null) => {
    if (!isNull(val)) {
      setTimeFrame({ from: val.from, to: val.to }, false);
      setBrowserParamsTf({ [TIMEFRAME_SEARCH_KEY]: `from=${val.from.value},to=${val.to.value}` });
    }
  };

  return <TimeframeSelector value={timeframe} onChange={handleTimeChange} stepper={false} />;
};

export default PageTimeframeSelector;
