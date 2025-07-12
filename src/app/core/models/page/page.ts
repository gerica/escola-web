export interface Page<T> {
  empty: boolean;
  first: boolean;
  last: boolean;
  size: number;
  number: number | undefined;
  totalElements: number;
  content: T[];
}

export const emptyPage = <T>(): Page<T> => ({
  empty: true,
  first: true,
  last: true,
  size: 0,
  number: undefined,
  totalElements: 0,
  content: [],
});
