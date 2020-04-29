import React from 'react';
import './PagesListControlsTop.scss';
import { SidebarControlPanel, SidebarControlPanelIcons } from '../SidebarBlocks';
import Icon from '../Icon';
import { DispatchToPropsMapResult, StateToPropsMapResult } from './PagesListControlsTopConnected';
import { useRouteMatch } from 'react-router-dom';
import { PagesListActionTypes } from '../../action-types';

interface PagesListControlsTopProps extends StateToPropsMapResult, DispatchToPropsMapResult {}

const PagesListControlsTop: React.FC<PagesListControlsTopProps> = ({
  createDraftPage,
  pagesFilter,
  isPagesFilterChanged,
  clearPagesFilter,
  getPages,
  getNotesForPage,
  arePagesLoading,
  areNotesForMealLoading,
  areNotesForPageLoading,
  isPageOperationInProcess,
  isNoteOperationInProcess,
}: PagesListControlsTopProps) => {
  const match = useRouteMatch<{ [key: string]: string }>('/pages/:id');

  const isControlDisabled =
    arePagesLoading ||
    areNotesForMealLoading ||
    areNotesForPageLoading ||
    isPageOperationInProcess ||
    isNoteOperationInProcess;

  const isClearFilterDisabled = isControlDisabled || !isPagesFilterChanged;

  const handleAddIconClick = (): void => {
    createDraftPage({
      id: 0,
      date: '',
      countNotes: 0,
      countCalories: 0,
    });
  };

  const handleRefreshPagesListIconClick = async (): Promise<void> => {
    const { type: getPagesActionType } = await getPages(pagesFilter);

    if (getPagesActionType === PagesListActionTypes.Success) {
      const matchParams = match?.params;
      // Prevents notes request when no page selected
      if (matchParams && !isNaN(+matchParams['id'])) {
        await getNotesForPage({
          pageId: +matchParams['id'],
        });
      }
    }
  };

  const handleResetFilterIconClick = (): void => {
    clearPagesFilter();
  };

  return (
    <SidebarControlPanel>
      <SidebarControlPanelIcons>
        <Icon type="add" onClick={handleAddIconClick} disabled={isControlDisabled}></Icon>
        <Icon type="refresh" onClick={handleRefreshPagesListIconClick} disabled={isControlDisabled}></Icon>
        <Icon type="filter" disabled></Icon>
        <Icon type="close" disabled={isClearFilterDisabled} onClick={handleResetFilterIconClick}></Icon>
      </SidebarControlPanelIcons>
    </SidebarControlPanel>
  );
};

export default PagesListControlsTop;
