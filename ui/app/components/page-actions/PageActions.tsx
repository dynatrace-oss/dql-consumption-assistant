import { Flex } from '@dynatrace/strato-components/layouts';
import React from 'react';
import { ErrorBoundaryWithRetry } from '../error-boundary/ErrorBoundaryFallbacks';
import AppRunQueryButton from './RunQueryButton/PageRunQueryButton';
import AppTimeframeSelector from './TimeFrameSelector/PageTimeframeSelector';
import type { RunQueryButtonType } from '../../interfaces/Interfaces';

interface PageActionsProps {
  runQueryButtonProps: RunQueryButtonType;
}

const PageActions: React.FC<PageActionsProps> = ({ runQueryButtonProps }) => {
  return (
    <ErrorBoundaryWithRetry>
      <Flex gap={4} style={{ justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '6px' }}>
        <AppTimeframeSelector />
        <AppRunQueryButton {...runQueryButtonProps} />
      </Flex>
    </ErrorBoundaryWithRetry>
  );
};

export default PageActions;
