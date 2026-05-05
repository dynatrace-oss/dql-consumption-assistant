import { Button } from '@dynatrace/strato-components/buttons';
import { useCurrentTheme } from '@dynatrace/strato-components/core';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading } from '@dynatrace/strato-components/typography';
import { EmptyState } from '@dynatrace/strato-components-preview/content';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ExternalLinkComponentForDirectLink } from '../../components/external-link/ExternalLinkComponent';
import { DashboardsCatergory } from '../../routes/RouteConstants';
import { giveRateCardSettingsLink } from '../../utils/helpers';
import {
  aceSolutionsVaultMessage,
  appDescription,
  appMessage,
  clickButtonMessage,
  emptyStateFooterMessage,
  rateCardSettingsMessage,
} from './messages';

const WelcomePage: React.FC = () => {
  // Take the current theme and dynamically show images
  const theme = useCurrentTheme();
  let image = './assets/ace_logo_horizontal_white.png';
  if (theme === 'light') {
    image = './assets/ace_logo_horizontal_black.svg';
  }

  const navigate = useNavigate();

  return (
    <Flex padding={16} flexDirection='column' style={{ alignItems: 'center' }}>
      <Heading>
        <img src={image} alt='' width={200} />
        <br></br>
      </Heading>
      <Heading>
        <FormattedMessage {...aceSolutionsVaultMessage} />
      </Heading>
      <EmptyState>
        <EmptyState.Title>
          <FormattedMessage {...appMessage} />
        </EmptyState.Title>
        <EmptyState.Details>
          <FormattedMessage {...appDescription} />
        </EmptyState.Details>
        <EmptyState.Actions>
          <Button
            variant='accent'
            onClick={() => {
              void navigate(DashboardsCatergory.TOP_DASHBOARDS);
            }}
          >
            <FormattedMessage {...clickButtonMessage} />
          </Button>
        </EmptyState.Actions>
        <EmptyState.Footer>
          <FormattedMessage {...emptyStateFooterMessage} />
          &nbsp; &nbsp;
          <ExternalLinkComponentForDirectLink message={rateCardSettingsMessage} href={giveRateCardSettingsLink()} />
        </EmptyState.Footer>
      </EmptyState>
    </Flex>
  );
};

export default WelcomePage;
