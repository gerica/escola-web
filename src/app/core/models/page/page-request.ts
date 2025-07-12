import { PageSort } from './page-sort';

export interface PageRequest {
  page: number;
  size?: number;
  sorts?: PageSort[];
}

export const firstPage = (size: number = 10) => ({
  page: 0,
  size,
});

export const firstPageAndSort = (size: number = 10, sort: PageSort) => ({
  page: 0,
  size,
  sorts: [sort],
});


