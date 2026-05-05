/* eslint-disable react/display-name */
import { Button } from "@dynatrace/strato-components/buttons";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import { type DataTableRef } from "@dynatrace/strato-components-preview/tables";
import { DownloadIcon } from "@dynatrace/strato-icons";
import React, { forwardRef } from "react";
import { FormattedMessage } from "react-intl";
import { ErrorBoundaryWithRetry } from "../error-boundary/ErrorBoundaryFallbacks";

type PropsType = { disabled: boolean };

const DataTableDownloadButton = forwardRef<DataTableRef, PropsType>(
  (props, ref) => {
    const handleDownloadButtonClick = () => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.downloadData("all");
      }
    };

    return (
      <ErrorBoundaryWithRetry>
        <Tooltip text="Download Data as CSV" placement="top">
          <Button
            variant="emphasized"
            disabled={props.disabled}
            onClick={handleDownloadButtonClick}
          >
            <Button.Prefix>
              <DownloadIcon />
            </Button.Prefix>
            <FormattedMessage
              defaultMessage="Download All Pages as CSV"
              id="OIaYLWD+JoeNHDnI"
            />
          </Button>
        </Tooltip>
      </ErrorBoundaryWithRetry>
    );
  },
);

export default DataTableDownloadButton;
