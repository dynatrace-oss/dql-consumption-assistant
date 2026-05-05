import { Page } from "@dynatrace/strato-components-preview/layouts";
import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./components/app-header/AppHeader";
import AppSidebar from "./components/app-sidebar/AppSidebar";

export const App: React.FC = () => {
  return (
    <Page>
      <Page.Header>
        <AppHeader />
      </Page.Header>
      <Page.Sidebar>
        <AppSidebar />
      </Page.Sidebar>
      <Page.Main>
        <Outlet />
      </Page.Main>
    </Page>
  );
};
