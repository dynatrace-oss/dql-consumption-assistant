import { Container, Flex } from '@dynatrace/strato-components/layouts';
import { Text, Link } from '@dynatrace/strato-components/typography';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { appLinkMessage, appTitleMessage } from './messages';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    void navigate('/');
  };

  return (
    <Container>
      <Flex flexDirection='column-reverse'>
        <Text>
          <FormattedMessage {...appTitleMessage} />
        </Text>
        <Link onClick={handleNavigation} style={{ cursor: 'pointer' }}>
          <FormattedMessage {...appLinkMessage} />
        </Link>
      </Flex>
    </Container>
  );
};

export default PageNotFound;
