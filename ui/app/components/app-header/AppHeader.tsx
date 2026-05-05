import { AppHeader as Header } from "@dynatrace/strato-components-preview/layouts";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { appNameMessage } from "./messages";

const AppHeader: React.FC = () => {
  const { search } = useLocation();

  return (
    <Header>
      {/* Nav Items in App Header */}
      {/* Updated names: https://developer.dynatracelabs.com/design/components-preview/layouts/AppHeader/#note-updated-navigation-component-names */}
      <Header.Navigation>
        {/* Navigate to homepage without removing search params, ref- VAST-385 */}
        <Header.Logo
          as={NavLink}
          to={`/${search}`}
          appName={appNameMessage.defaultMessage}
        />
      </Header.Navigation>
    </Header>
  );
};

export default AppHeader;
