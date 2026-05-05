import { Text } from '@dynatrace/strato-components/typography';
import Borders from '@dynatrace/strato-design-tokens/borders';
import Colors from '@dynatrace/strato-design-tokens/colors';
import Spacings from '@dynatrace/strato-design-tokens/spacings';
import React, { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { css, styled } from 'styled-components';

const SelectedButtonCss = css`
  &::before {
    background-color: ${Colors.Border.Primary.Accent};
    top: ${Spacings.Size6};
    bottom: ${Spacings.Size6};
  }

  &:hover::before {
    background-color: ${Colors.Border.Primary.AccentHover};
  }

  &:active::before {
    background-color: ${Colors.Border.Primary.AccentActive};
  }
`;

const HighlightedButtonCss = css`
  background-color: ${Colors.Background.Field.Primary.Emphasized};
  color: ${Colors.Text.Primary.Default};

  &:hover {
    background-color: ${Colors.Background.Field.Primary.EmphasizedHover};
    color: ${Colors.Text.Primary.Default};
  }

  &:active {
    background-color: ${Colors.Background.Field.Primary.EmphasizedActive};
    color: ${Colors.Text.Primary.Default};
  }
`;

const ItemDefaultCss = css`
  padding-inline: ${Spacings.Size8};
`;

const ItemCondensedCss = css`
  padding-inline: ${Spacings.Size24} ${Spacings.Size8};

  &::before {
    content: '';
    position: absolute;
    background-color: ${Colors.Border.Neutral.Default};
    width: ${Spacings.Size2};
    top: 0;
    bottom: 0;
    left: ${Spacings.Size12};
  }

  &:hover::before {
    background-color: ${Colors.Border.Neutral.DefaultHover};
    top: ${Spacings.Size6};
    bottom: ${Spacings.Size6};
  }

  &:active::before {
    background-color: ${Colors.Border.Neutral.DefaultActive};
  }
`;

const StyledItem = styled.div<{
  $variant: SidebarItemProps['variant'];
  $isSelected: SidebarItemProps['isSelected'];
  $isHighlighted: SidebarItemProps['isHighlighted'];
}>`
  display: flex;
  align-items: center;
  gap: ${Spacings.Size8};
  position: relative;
  border-radius: ${Borders.Radius.Field.Default};
  color: ${Colors.Text.Neutral.Default};
  text-decoration: none;
  padding-block: ${Spacings.Size6};
  border: none;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: ${Colors.Background.Field.Neutral.DefaultHover};
  }

  &:active {
    background-color: ${Colors.Background.Field.Neutral.DefaultActive};
  }

  ${({ $variant }) => ($variant === 'condensed' ? ItemCondensedCss : ItemDefaultCss)}
  ${({ $isSelected }) => $isSelected && SelectedButtonCss}
  ${({ $isHighlighted }) => $isHighlighted && HighlightedButtonCss}
`;

type SidebarItemProps<T extends string | undefined = undefined> = {
  id: string;
  displayName: string;
  to?: T;
  prefix?: ReactNode;
  suffix?: ReactNode;
  variant?: 'default' | 'condensed';
  isSelected?: boolean;
  isHighlighted?: boolean;
} & Omit<T extends string ? LinkProps : ComponentPropsWithoutRef<'button'>, 'prefix'>;

export const SidebarItem = <T extends string | undefined = undefined>({
  id,
  displayName,
  prefix,
  suffix,
  variant,
  isSelected,
  isHighlighted,
  ...props
}: SidebarItemProps<T>) => {
  return (
    <StyledItem
      as={props.to ? Link : 'button'}
      data-testid={`sidebar-item-${id}`}
      $variant={variant}
      $isSelected={isSelected}
      $isHighlighted={isHighlighted}
      {...(props as Record<string, unknown>)}
    >
      {prefix}

      <Text as='span' textStyle='base-emphasized'>
        {displayName}
      </Text>

      {suffix}
    </StyledItem>
  );
};
