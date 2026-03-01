export interface PaginationMeta {
  page: number
  rpp: number
  more: boolean
}

export interface PaginatedResponse<T> extends PaginationMeta {
  list: T[]
}
