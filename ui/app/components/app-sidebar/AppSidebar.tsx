import { Flex } from '@dynatrace/strato-components/layouts';
import { Page, TitleBar } from '@dynatrace/strato-components-preview/layouts';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { StyledSidebar } from '../../constants/sidebar-utils';
import { ErrorBoundaryWithRetry } from '../error-boundary/ErrorBoundaryFallbacks';
import { sideBarMenuTitleMessage, sideBarSubTitleMessage } from './messages';
import SidebarCategory from './SidebarCategory';
import { getSidebarConfig } from './SidebarConfig';
import { type CategoryType } from './types';

const AppSidebar: React.FC = () => {
  const [selectedType, setSelectedType] = useState<CategoryType | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string>('');
  const [expandedCategory, setExpandedCategory] = useState<CategoryType | null>(null);
  const previousPathnameRef = useRef<string | undefined>(undefined);

  const { pathname, search } = useLocation();
  const sidebarConfig = getSidebarConfig(search);

  useEffect(() => {
    if (pathname === '/') {
      setSelectedType(null);
      setSelectedSubType('');
      setExpandedCategory(null);
      return;
    }

    if (previousPathnameRef.current === pathname) {
      return;
    }
    previousPathnameRef.current = pathname;

    let bestMatch: {
      category: (typeof sidebarConfig)[0];
      subItem: (typeof sidebarConfig)[0]['subItems'][0];
      isFirstChild: boolean;
    } | null = null;
    let longestMatchLength = 0;

    for (const category of sidebarConfig) {
      for (let i = 0; i < category.subItems.length; i++) {
        const subItem = category.subItems[i];
        // Only use the pathname part of targetUrl for matching
        const subItemPath = subItem.targetUrl.split('?')[0];
        if (pathname === subItemPath || pathname.startsWith(subItemPath + '/')) {
          const matchLength = subItemPath.length;
          const isFirstChild = i === 0;

          if (
            matchLength > longestMatchLength ||
            (matchLength === longestMatchLength && isFirstChild && !bestMatch?.isFirstChild)
          ) {
            longestMatchLength = matchLength;
            bestMatch = { category, subItem, isFirstChild };
          }
        }
      }
    }

    if (bestMatch) {
      setSelectedType(bestMatch.category.categoryType);
      setSelectedSubType(bestMatch.subItem.categorySubType);
      setExpandedCategory(bestMatch.category.categoryType);
    }
  }, [pathname, sidebarConfig]);

  const handleToggle = (categoryType: CategoryType) => {
    setExpandedCategory((prev) => (prev === categoryType ? null : categoryType));
  };

  return (
    <div>
      <ErrorBoundaryWithRetry>
        <TitleBar>
          <TitleBar.Title>
            <FormattedMessage {...sideBarMenuTitleMessage} />
          </TitleBar.Title>
          <TitleBar.Subtitle>
            <FormattedMessage {...sideBarSubTitleMessage} />
          </TitleBar.Subtitle>
          <TitleBar.Action>
            <Page.PanelControlButton />
          </TitleBar.Action>
        </TitleBar>

        <StyledSidebar data-testid='sidebar-v2'>
          <Flex flexDirection='column'>
            {sidebarConfig.map((currentItem) => (
              <SidebarCategory
                key={currentItem.categoryType}
                currentItem={currentItem}
                selectedType={selectedType}
                selectedSubType={selectedSubType}
                isExpanded={expandedCategory === currentItem.categoryType}
                onToggle={handleToggle}
              />
            ))}
          </Flex>
        </StyledSidebar>
      </ErrorBoundaryWithRetry>
    </div>
  );
};

export default AppSidebar;
