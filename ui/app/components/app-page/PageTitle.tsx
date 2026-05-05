import { TitleBar, Page } from '@dynatrace/strato-components-preview/layouts';
import { isUndefined } from 'lodash-es';
import React, { type ReactNode } from 'react';

interface SinglePageTitleProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

/** This Component is Reusable for displaying title and description accross the pages/routes  */
const PageTitle: React.FC<SinglePageTitleProps> = ({ title, description, actions }) => {
  return (
    <TitleBar>
      <TitleBar.Prefix>
        <Page.PanelControlButton target='sidebar' />
      </TitleBar.Prefix>
      <TitleBar.Title>{title}</TitleBar.Title>
      <TitleBar.Subtitle>{description}</TitleBar.Subtitle>
      {/* Defaulting, all the actions in the suffix. */}
      {!isUndefined(actions) ? (
        <TitleBar.Action style={{ width: '100%' }}>
          <TitleBar.Suffix>{actions}</TitleBar.Suffix>
        </TitleBar.Action>
      ) : null}
    </TitleBar>
  );
};

export default PageTitle;
