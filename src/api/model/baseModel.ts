export interface BasicPageParams {
  page: number;
  page_size: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total_count: number;
}
