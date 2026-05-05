import { AppRoot } from "@dynatrace/strato-components-preview/core";
import { ToastContainer } from "@dynatrace/strato-components/notifications";
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RateCardContextProvider } from "./app/context/rate-card-context/RateCardContext";
import { TimeframeContextProvider } from "./app/context/timeframe-context/TimeframeContext";
import { router } from "./app/routes/Router";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <AppRoot>
    {/* Timeframe Provider */}
    <TimeframeContextProvider>
      {/* Rate card Provider */}
      <RateCardContextProvider>
        {/* App Routes */}
        <RouterProvider router={router} />

        {/* Toast Container for displaying toasts */}
        <ToastContainer />
      </RateCardContextProvider>
    </TimeframeContextProvider>
  </AppRoot>,
);
