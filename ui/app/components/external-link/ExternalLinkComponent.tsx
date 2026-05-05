import { Flex } from '@dynatrace/strato-components/layouts';
import { ExternalLink } from '@dynatrace/strato-components/typography';
import { ExternalLinkIcon } from '@dynatrace/strato-icons';
import React, { type JSXElementConstructor, type ReactElement } from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

interface ExternalLinkComponentForMenuItemProps {
  message?: { defaultMessage: string; description: string; id: string };
}

export const ExternalLinkComponentForMenuItem: React.FC<ExternalLinkComponentForMenuItemProps> = ({ message }) => {
  return (
    <Flex width='inherit' justifyContent='space-between'>
      <FormattedMessage {...message} />
      <ExternalLinkIcon style={{ flexShrink: 0 }} />
    </Flex>
  );
};

interface ExternalLinkComponentForDirectLinkProps {
  message?: MessageDescriptor;
  href: string;
  values?: Record<string, string | number | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>>>;
}

export const ExternalLinkComponentForDirectLink: React.FC<ExternalLinkComponentForDirectLinkProps> = ({
  message,
  href,
  values,
}) => {
  return (
    <ExternalLink href={href}>
      <FormattedMessage {...message} values={values} />
    </ExternalLink>
  );
};
