export interface QueryOptions {
  page: number
  limit: number
}

export interface GetDriversOptions extends QueryOptions {
  firstName?: string
  lastName?: string
  nationality?: string
  year: number
}
