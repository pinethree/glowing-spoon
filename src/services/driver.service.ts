
import { Kysely } from 'kysely'
import { Database } from '../db/connection'
import { GetDriversOptions } from '../types'

export class DriverService {
  private readonly db: Kysely<Database>

  constructor (db: Kysely<Database>) {
    this.db = db
  }

  async getList ({ page, limit, firstName, lastName, nationality, year }: GetDriversOptions) {
    const offset = (page - 1) * limit

    let query = this.db.selectFrom('drivers')
      .innerJoin('driverTeams', 'driverTeams.driverId', 'drivers.id')
      .innerJoin('teams', 'teams.id', 'driverTeams.teamId')
      .select(['drivers.id', 'drivers.firstName', 'drivers.lastName', 'drivers.nationality', 'teams.name as team', 'driverTeams.position'])
      .where('driverTeams.year', '=', year)
      .orderBy('driverTeams.points', 'desc')
      .limit(limit)
      .offset(offset)

    if (firstName !== undefined) {
      query = query.where('firstName', '=', firstName)
    }

    if (lastName !== undefined) {
      query = query.where('lastName', '=', lastName)
    }

    if (nationality !== undefined) {
      query = query.where('nationality', '=', nationality)
    }

    return await query.execute()
  }

  async getByID (id: number) {
    return await this.db
      .selectFrom('drivers')
      .innerJoin('driverTeams', 'driverTeams.driverId', 'drivers.id')
      .innerJoin('teams', 'teams.id', 'driverTeams.teamId')
      .distinctOn('drivers.id')
      .select(['drivers.id', 'drivers.firstName', 'drivers.lastName', 'drivers.nationality', 'teams.name as team', 'driverTeams.position'])
      .where('drivers.id', '=', id).execute()
  }
}
