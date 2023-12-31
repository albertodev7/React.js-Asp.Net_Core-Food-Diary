import { API_URL } from 'src/config';
import { type SortOrder } from '../__shared__/models';
import {
  createApiCallAsyncThunk,
  createUrl,
  downloadFile,
  handleEmptyResponse,
} from '../__shared__/utils';
import {
  type ExportPagesToJsonRequest,
  type Page,
  type PageCreateEdit,
  type PagesSearchResult,
} from './models';

export interface GetPagesRequest {
  startDate: string | null;
  endDate: string | null;
  sortOrder: SortOrder;
  pageNumber: number;
  pageSize: number;
}

export interface EditPageRequest {
  id: number;
  page: PageCreateEdit;
}

export interface PageByIdResponse {
  currentPage: Page;
}

export const getPages = createApiCallAsyncThunk<PagesSearchResult, GetPagesRequest>(
  'pages/getPages',
  request => createUrl(`${API_URL}/api/v1/pages`, { ...request }),
  async response => await response.json(),
  'Failed to get pages',
);

export const getPageById = createApiCallAsyncThunk<PageByIdResponse, number>(
  'pages/getPageById',
  id => `${API_URL}/api/v1/pages/${id}`,
  async response => await response.json(),
  'Failed to get page',
);

export const createPage = createApiCallAsyncThunk<number, PageCreateEdit>(
  'pages/createPage',
  () => `${API_URL}/api/v1/pages`,
  async response => Number(await response.text()),
  'Failed to create page',
  {
    method: 'POST',
    bodyCreator: page => JSON.stringify(page),
  },
);

export const editPage = createApiCallAsyncThunk<void, EditPageRequest>(
  'pages/editPage',
  ({ id }) => `${API_URL}/api/v1/pages/${id}`,
  handleEmptyResponse,
  'Failed to update page',
  {
    method: 'PUT',
    bodyCreator: ({ page }) => JSON.stringify(page),
  },
);

export const deletePages = createApiCallAsyncThunk<void, number[]>(
  'pages/deletePages',
  () => `${API_URL}/api/v1/pages/batch`,
  handleEmptyResponse,
  'Failed to delete pages',
  {
    method: 'DELETE',
    bodyCreator: pageids => JSON.stringify(pageids),
  },
);

export const exportPagesToJson = createApiCallAsyncThunk<void, ExportPagesToJsonRequest>(
  'pages/exportToJson',
  params => createUrl(`${API_URL}/api/v1/exports/json`, { ...params }),
  async (response, { startDate, endDate }) => {
    const blob = await response.blob();
    downloadFile(blob, `FoodDiary_${startDate}_${endDate}.json`);
  },
  'Failed to export pages',
);

export const importPages = createApiCallAsyncThunk<void, File>(
  'pages/importPages',
  () => `${API_URL}/api/v1/imports/json`,
  handleEmptyResponse,
  'Failed to import pages',
  {
    method: 'POST',
    contentType: 'none',
    bodyCreator: importFile => {
      const formData = new FormData();
      formData.append('importFile', importFile, importFile.name);
      return formData;
    },
  },
);

export const getDateForNewPage = createApiCallAsyncThunk<string, void>(
  'pages/getDateForNewPage',
  () => `${API_URL}/api/v1/pages/date`,
  async response => await response.text(),
  'Failed to get date for new page',
);