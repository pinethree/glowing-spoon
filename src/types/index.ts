export interface QueryOptions {
  page: number
  limit: number
  year: number
}

export interface GetDriversOptions extends QueryOptions {
  firstName?: string
  lastName?: string
  nationality?: string
}

export interface GetTeamsOptions extends QueryOptions {
  name?: string
}

export interface GetRaceOptions extends QueryOptions {
  grandPrix?: string
  team?: string
}
