import { Menu } from '@dynatrace/strato-components-preview/navigation';
import { DynatraceSignetIcon } from '@dynatrace/strato-icons';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DT_DQL_DOC_LINK } from '../../../constants/ExternalLinks';
import { learnDqlMessage } from './messages';

const LearnDQLItem: React.FC = () => {
  const handleNavigation = () => {
    window.open(DT_DQL_DOC_LINK, '_blank');
  };

  return (
    <Menu.Item onSelect={handleNavigation}>
      <Menu.Prefix>
        <DynatraceSignetIcon />
      </Menu.Prefix>
      <FormattedMessage {...learnDqlMessage} />
      {/* </Menu.Link> */}
    </Menu.Item>
  );
};

export default LearnDQLItem;
