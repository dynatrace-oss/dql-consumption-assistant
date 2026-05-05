import { Menu } from '@dynatrace/strato-components-preview/navigation';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { giveRateCardSettingsLink } from '../../../utils/helpers';
import { ExternalLinkComponentForMenuItem } from '../../external-link/ExternalLinkComponent';
import { classicSettingsMessage, settingsIntentbuttonMessage } from './messages';

const RateCardSettingsItem: React.FC = () => {
  return (
    <>
      <Menu.Label>
        <FormattedMessage {...classicSettingsMessage} />
      </Menu.Label>
      <Menu.Link
        href={giveRateCardSettingsLink()}
        target='_blank'
      >
        <ExternalLinkComponentForMenuItem message={settingsIntentbuttonMessage} />
      </Menu.Link>
    </>
  );
};

export default RateCardSettingsItem;
