
import { Kysely } from 'kysely'
import { Database } from '../db/connection'
import { GetTeamsOptions } from '../types'

export class TeamService {
  private readonly db: Kysely<Database>

  constructor (db: Kysely<Database>) {
    this.db = db
  }

  async getList ({ page, limit, name, year }: GetTeamsOptions) {
    const offset = (page - 1) * limit

    let query = this.db.selectFrom('teams')
      .innerJoin('teamPoints', 'teamPoints.teamId', 'teams.id')
      .select(['teams.id', 'teams.name', 'teamPoints.year', 'teamPoints.position', 'teamPoints.points'])
      .where('teamPoints.year', '=', year)
      .orderBy('teamPoints.points', 'desc')
      .limit(limit)
      .offset(offset)

    if (name) {
      query = query.where('teams.name', '=', name)
    }

    return await query.execute()
  }

  async getByID (id: number) {
    return await this.db
      .selectFrom('teams')
      .innerJoin('teamPoints', 'teamPoints.teamId', 'teams.id')
      .select(['teams.id', 'teams.name', 'teamPoints.year', 'teamPoints.position', 'teamPoints.points'])
      .distinctOn('teams.id')
      .where('teams.id', '=', id)
      .execute()
  }
}
