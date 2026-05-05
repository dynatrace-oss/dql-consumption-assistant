import { RunQueryButton } from '@dynatrace/strato-components-preview/buttons';
import React from 'react';
import { type RunQueryButtonType } from '../../../interfaces/Interfaces';

/**
 * Run Query Button, to run the query on demand
 */

const PageRunQueryButton: React.FC<RunQueryButtonType> = ({ isError, isLoading, handleRunQueryClick }) => {
  const giveButtonState = () => {
    if (isLoading) {
      return 'loading';
    } else if (isError) {
      return 'error';
    }
    return 'idle';
  };

  return (
    <RunQueryButton
      onClick={() => {
        handleRunQueryClick();
      }}
      queryState={giveButtonState()}
      disabled={isLoading}
    />
  );
};

export default PageRunQueryButton;
