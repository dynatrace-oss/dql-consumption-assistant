import { Button } from '@dynatrace/strato-components/buttons';
import Borders from '@dynatrace/strato-design-tokens/borders';
import Colors from '@dynatrace/strato-design-tokens/colors';
import Spacings from '@dynatrace/strato-design-tokens/spacings';
import Typography from '@dynatrace/strato-design-tokens/typography';
import styled, { css } from 'styled-components';

export const StyledSidebar = styled.div`
  position: relative;
  margin-left: -6px;
  margin-right: -12px;

  border-radius: ${Borders.Radius.Container.Default};
  padding: ${Spacings.Size6};
`;

// adds selection indicator on left side of button
const SelectedIndicatorCss = css`
  &::after {
    position: absolute;
    content: '';
    background-color: ${Colors.Border.Primary.Accent};
    width: ${Spacings.Size2};
    top: ${Spacings.Size6};
    bottom: ${Spacings.Size6};
    left: ${Spacings.Size4};
  }
`;

// changes color of background, text, icon
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

export const StyledSidebarItem = styled(Button)<{ $isSelected: boolean; $isHighlighted: boolean; $isSubItem: boolean }>`
  color: ${Colors.Text.Neutral.Default};
  text-align: start;
  font-weight: ${Typography.Text.Base.Default.Weight};
  padding-left: ${Spacings.Size12};
  padding-right: ${Spacings.Size12};

  &:focus-visible {
    outline-offset: -2px;
  }

  margin-left: ${({ $isSubItem }) => ($isSubItem ? '11%' : '0%')};
  width: ${({ $isSubItem }) => ($isSubItem ? '89%' : '100%')};
  padding-left: ${({ $isSubItem, $isSelected }) => ($isSubItem && !$isSelected ? Spacings.Size8 : undefined)};

  ${({ $isSelected }) => ($isSelected ? SelectedIndicatorCss : undefined)}
  ${({ $isHighlighted }) => ($isHighlighted ? HighlightedButtonCss : undefined)}
`;
