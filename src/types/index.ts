export interface QueryOptions {
  page: number
  limit: number
  year: number
  orderBy?: string
}

export interface GetDriversOptions extends QueryOptions {
  firstName?: string
  lastName?: string
  nationality?: string
}

export interface GetTeamsOptions extends QueryOptions {
  name?: string
}
