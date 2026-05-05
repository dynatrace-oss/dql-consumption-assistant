/* eslint-disable react/display-name */
import { Button } from "@dynatrace/strato-components/buttons";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import { type DataTableRef } from "@dynatrace/strato-components-preview/tables";
import { OptionsIcon } from "@dynatrace/strato-icons";
import React, { forwardRef } from "react";
import { ErrorBoundaryWithRetry } from "../error-boundary/ErrorBoundaryFallbacks";

type PropsType = { disabled?: boolean };

const DataTableColumnSettings = forwardRef<DataTableRef, PropsType>(
  (props, ref) => {
    const openColumnSettingsModal = () => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.openColumnSettings({
          columnVisibility: true,
          columnOrder: true,
          columnPinning: false,
        });
      }
    };

    return (
      <ErrorBoundaryWithRetry>
        <Tooltip text="Column Visibility Settings" placement="top">
          <Button
            onClick={openColumnSettingsModal}
            variant="emphasized"
            disabled={props.disabled ?? false}
          >
            <Button.Prefix>
              <OptionsIcon />
            </Button.Prefix>
          </Button>
        </Tooltip>
      </ErrorBoundaryWithRetry>
    );
  },
);

export default DataTableColumnSettings;
