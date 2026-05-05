import { Flex } from "@dynatrace/strato-components/layouts";
import React, { Fragment, type ReactNode } from "react";
import {
  ErrorBoundaryWithRetry,
  ErrorFallbackUIFetchingDQL,
} from "../error-boundary/ErrorBoundaryFallbacks";
import PageActions from "../page-actions/PageActions";
import PageTitle from "./PageTitle";
import type { ErrorResponseFromGrail } from "../../interfaces/Interfaces";

interface AppPageProps {
  title: string;
  description: string;
  isSuccess: boolean;
  isError: boolean;
  error: ErrorResponseFromGrail;
  children: ReactNode;
  handleRunQueryClick: () => void;
  isLoading: boolean;
}

/**
 * App Page render with this component
 * This is made of sub-reusable components
 */
const AppPage: React.FC<AppPageProps> = (props) => {
  const {
    description,
    error,
    isError,
    title,
    children,
    isLoading,
    handleRunQueryClick,
    isSuccess,
  } = props;
  return (
    <ErrorBoundaryWithRetry>
      <Flex
        flexDirection="column"
        justifyContent="center"
        gap={16}
        style={{ justifyContent: "flex-end" }}
      >
        <PageTitle
          title={title}
          description={description}
          actions={
            <PageActions
              runQueryButtonProps={{
                isError,
                isLoading,
                isSuccess,
                handleRunQueryClick,
              }}
            />
          }
        />
        {isError ? (
          <ErrorFallbackUIFetchingDQL error={error} />
        ) : (
          <Fragment>{children}</Fragment>
        )}
      </Flex>
    </ErrorBoundaryWithRetry>
  );
};

export default AppPage;
