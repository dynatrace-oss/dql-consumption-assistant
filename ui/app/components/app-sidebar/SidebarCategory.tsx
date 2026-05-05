import Spacings from "@dynatrace/strato-design-tokens/spacings";
import {
  ChevronDownSmallIcon,
  ChevronRightSmallIcon,
} from "@dynatrace/strato-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIconByCategoryType } from "./SidebarIcons";
import { SidebarItem } from "./SidebarItem";
import { CategoryType, type SidebarItemConfig } from "./types";

export interface SidebarCategoryProps {
  readonly currentItem: SidebarItemConfig;
  readonly selectedType: CategoryType | null;
  readonly selectedSubType: string;
  readonly defaultExpanded?: boolean;
  readonly isExpanded?: boolean;
  readonly onToggle?: (categoryType: CategoryType) => void;
}

export default function SidebarCategory({
  currentItem,
  selectedType,
  selectedSubType,
  defaultExpanded = false,
  isExpanded,
  onToggle,
}: SidebarCategoryProps) {
  const [internalExpand, setInternalExpand] = useState(defaultExpanded);
  const navigate = useNavigate();
  const expand = isExpanded ?? internalExpand;
  const isParentActive = selectedType === currentItem.categoryType;

  const toggleExpand = () => {
    const willExpand = !expand;

    if (willExpand && currentItem.subItems.length > 0) {
      const navigationResult = navigate(currentItem.subItems[0].targetUrl);
      if (navigationResult) {
        navigationResult.catch((error: unknown) => {
          console.error("Navigation failed:", { error });
          setInternalExpand(false);
        });
      }
    }

    if (onToggle) {
      onToggle(currentItem.categoryType);
    } else {
      setInternalExpand(willExpand);
    }
  };

  const icon = (
    <span style={{ display: "flex", marginLeft: "auto" }}>
      {expand ? <ChevronDownSmallIcon /> : <ChevronRightSmallIcon />}
    </span>
  );

  return (
    <>
      <SidebarItem
        id={CategoryType[currentItem.categoryType]}
        key={currentItem.categoryType}
        displayName={currentItem.displayName}
        prefix={getIconByCategoryType(currentItem.categoryType)}
        suffix={icon}
        onClick={toggleExpand}
        isHighlighted={isParentActive}
        style={{ width: "100%", marginBlockEnd: Spacings.Size8 }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateRows: expand ? "1fr" : "0fr",
          transition: "grid-template-rows 0.15s ease-in-out",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ marginBlockEnd: Spacings.Size8 }}>
            {currentItem.subItems.map((subItem) => (
              <SidebarItem
                id={subItem.categorySubType}
                key={subItem.categorySubType}
                displayName={subItem.displayName}
                to={subItem.targetUrl}
                isSelected={
                  selectedSubType === subItem.categorySubType &&
                  selectedType === currentItem.categoryType
                }
                isHighlighted={
                  selectedSubType === subItem.categorySubType &&
                  selectedType === currentItem.categoryType
                }
                variant="condensed"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
