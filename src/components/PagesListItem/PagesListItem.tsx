import React from 'react';
import './PagesListItem.scss';
import Badge from '../Badge';
import {
  SidebarListItem,
  SidebarListItemLink,
  SidebarListItemControls,
  useActiveLinkClassName,
} from '../SidebarBlocks';
import { BadgesContainer } from '../ContainerBlocks';
import { Checkbox } from '../Controls';
import { PagesListItemDispatchToPropsMapResult, PagesListItemStateToPropsMapResult } from './PagesListItemConnected';
import { PageItem } from '../../models';
import { formatDateStr, DateFormat } from '../../utils/date-utils';
import PagesListItemEditableConnected from './PagesListItemEditableConnected';
import { getWordWithCount } from '../../utils/string-utils';

interface PagesListItemProps extends PagesListItemStateToPropsMapResult, PagesListItemDispatchToPropsMapResult {
  page: PageItem;
}

const PagesListItem: React.FC<PagesListItemProps> = ({
  page,
  editablePagesIds,
  selectedPagesIds,
  setSelectedForPage,
}: PagesListItemProps) => {
  const isEditable = editablePagesIds.some(id => page.id === id);
  const isSelected = selectedPagesIds.some(id => page.id === id);

  const handlePageCheck = (): void => {
    setSelectedForPage(!isSelected, page.id);
  };

  const notesBadgeLabel = getWordWithCount(page.countNotes, 'note', 'notes');
  const caloriesBadgeLabel = `${page.countCalories} cal`;

  const activeLinkClassName = useActiveLinkClassName(isSelected);

  if (isEditable) {
    return <PagesListItemEditableConnected page={page}></PagesListItemEditableConnected>;
  }

  return (
    <SidebarListItem selected={isSelected}>
      <SidebarListItemLink to={`/pages/${page.id}`} activeClassName={activeLinkClassName} selected={isSelected}>
        <div>{formatDateStr(page.date, DateFormat.SlashDMY)}</div>
        <BadgesContainer>
          <Badge label={notesBadgeLabel} selected={isSelected}></Badge>
          <Badge label={caloriesBadgeLabel} selected={isSelected}></Badge>
        </BadgesContainer>
      </SidebarListItemLink>
      <SidebarListItemControls>
        <Checkbox checked={isSelected} onCheck={handlePageCheck}></Checkbox>
      </SidebarListItemControls>
    </SidebarListItem>
  );
};

export default PagesListItem;
