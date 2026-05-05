import {
  showToast,
  type ToastOptions,
} from "@dynatrace/strato-components/notifications";
import type React from "react";

interface ToastParamsType {
  title: string;
  message?: string;
  lifespan?: number | "infinite";
  actions?: React.JSX.Element;
  position?: ToastOptions["position"];
}

const DEFAULT_TOAST_POSITION = "bottom-left";

export const showSuccessToast = (args: ToastParamsType) => {
  return showToast({
    ...args,
    type: "success",
    position: args.position ?? DEFAULT_TOAST_POSITION,
  });
};

export const showErrorToast = (args: ToastParamsType) => {
  return showToast({
    ...args,
    type: "critical",
    position: args.position ?? DEFAULT_TOAST_POSITION,
  });
};

export const showInfoToast = (args: ToastParamsType) => {
  return showToast({
    ...args,
    type: "info",
    position: args.position ?? DEFAULT_TOAST_POSITION,
  });
};
