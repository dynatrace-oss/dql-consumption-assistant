import { Button } from "@dynatrace/strato-components/buttons";
import { Container, Flex, Surface } from "@dynatrace/strato-components/layouts";
import {
  Text,
  Paragraph,
  Heading,
} from "@dynatrace/strato-components/typography";
import Colors from "@dynatrace/strato-design-tokens/colors";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormattedMessage } from "react-intl";
import type { ErrorResponseFromGrail } from "../../interfaces/Interfaces";

interface ErrorBoundaryFallbackComponentProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorBoundaryFallbackComponent = ({
  error,
  resetErrorBoundary,
}: ErrorBoundaryFallbackComponentProps) => {
  return (
    <Flex>
      <Surface>
        <Paragraph>
          <FormattedMessage
            defaultMessage="Something went wrong:"
            id="/fWn7iGI2LV4yTM7"
          />
          &nbsp; &nbsp;
          {error.message}
          <br />
          <br />
        </Paragraph>
        <Button
          onClick={() => {
            resetErrorBoundary();
          }}
          variant="emphasized"
        >
          <FormattedMessage defaultMessage="Try Again" id="zvL+CTto+pcMfT2b" />
        </Button>
      </Surface>
    </Flex>
  );
};

interface ErrorFallbackUIFetchingDQLProps {
  error: ErrorResponseFromGrail;
}

export const ErrorFallbackUIFetchingDQL = ({
  error,
}: ErrorFallbackUIFetchingDQLProps) => {
  if (error?.message) {
    const matchedErrorType = new RegExp(/errorType:\s*"([^"]+)"/).exec(
      error.message,
    );
    const errorType = matchedErrorType ? matchedErrorType[1] : "Unknown Error!";

    const matchedErrorExceptionType = new RegExp(
      /exceptionType:\s*"([^"]+)"/,
    ).exec(error.message);
    const errorExceptionType = matchedErrorExceptionType
      ? matchedErrorExceptionType[1]
      : "Unknown Error Exception!";

    const matchedErrorMessage = new RegExp(/errorMessage:\s*"([^"]+)"/).exec(
      error.message,
    );
    const errorMessage = matchedErrorMessage
      ? matchedErrorMessage[1]
      : "UnExpected Error!";

    console.error(errorMessage, { error });

    return (
      <Container mt={8}>
        <Heading level={4} style={{ color: Colors.Text.Critical.Default }}>
          <FormattedMessage
            defaultMessage="Error while Querying Records"
            id="Ez6a1C7Vhu2nmww3"
          />
        </Heading>
        <br />
        <Text style={{ color: Colors.Text.Critical.Default }}>
          <FormattedMessage
            defaultMessage="Error Type: "
            id="+IToMu49fGrq2zdn"
          />{" "}
          {errorType}
        </Text>
        <br />
        <Text style={{ color: Colors.Text.Critical.Default }}>
          <FormattedMessage
            defaultMessage="Error Exception: "
            id="TeoXdwX/7RujvJu7"
          />{" "}
          {errorExceptionType}
        </Text>
        <br />
        <Text style={{ color: Colors.Text.Critical.Default }}>
          <FormattedMessage
            defaultMessage="Error Message: "
            id="+xGviTkKs7ChJ5pD"
          />
          {errorMessage}
        </Text>
        <br />
      </Container>
    );
  }
};

interface ErrorBoundaryFallbackProps {
  children: React.ReactNode;
}

/** Error Boundary Fallback Component with Re-try button */
export const ErrorBoundaryWithRetry: React.FC<ErrorBoundaryFallbackProps> = ({
  children,
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

/** Error Boundary Fallback Component when DQL Query Fails */
export const ErrorBoundaryWithDqlQueryFailure: React.FC<
  ErrorBoundaryFallbackProps
> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackUIFetchingDQL}>
      {children}
    </ErrorBoundary>
  );
};
