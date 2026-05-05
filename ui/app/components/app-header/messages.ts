import { defineMessage } from "react-intl";
import { WORKFLOW_VERSION } from "../../constants/constants";

export const appNameMessage = defineMessage({
  defaultMessage: "DQL Consumption Assistant",
  description: "This is App Name",
  id: "7UqI6SwjAeF+vu66",
});

export const appActionMenuMessage = defineMessage({
  defaultMessage: "App Actions Menu",
  description: "Label for App Actions Menu",
  id: "rJjodKVbChKawQJa",
});

// Settings Menu
export const settingsButtonMessage = defineMessage({
  defaultMessage: "Settings",
  description: "Button label for Settings",
  id: "6HOx9yD99JnVdgwu",
});

export const workflowExternalLinkButtonMessage = (version: string) =>
  defineMessage({
    defaultMessage: "Go To Workflow ({version})",
    values: { version },
    description: "Menu external link",
    id: "MAG2zPF75utqgwPu",
  });

// Microguide
export const microguideTitleMessage = defineMessage({
  defaultMessage: "New workflow version available ({version})",
  values: { version: WORKFLOW_VERSION },
  description: "Title for microguide",
  id: "YBs9PvVemOifw0Cw",
});

export const microguideDescriptionMessage = defineMessage({
  defaultMessage:
    "You are currently using an older version of this workflow. You can continue using it, or delete it to install the new version.",
  description: "description for microguide",
  id: "qJarJIJ5UL3qO9ut",
});
