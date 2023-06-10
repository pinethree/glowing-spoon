
import { Kysely, sql } from 'kysely'
import { Database } from '../db/connection'
import { GetRaceOptions } from '../types'

export class RaceService {
  private readonly db: Kysely<Database>

  constructor (db: Kysely<Database>) {
    this.db = db
  }

  async getList ({ page, limit, year, grandPrix, team }: GetRaceOptions) {
    const offset = (page - 1) * limit

    let query = this.db
      .selectFrom('races')
      .innerJoin('drivers', 'drivers.id', 'races.winnerId')
      .innerJoin('teams', 'teams.id', 'races.teamId')
      .select(() => [
        'races.id',
        'races.grandPrix',
        'races.raceDate',
        sql<string>`concat(first_name, ' ', last_name)`.as('winner'),
        'teams.name as team'
      ])
      .where('races.year', '=', year)
      .orderBy('races.raceDate', 'desc')
      .limit(limit)
      .offset(offset)

    if (grandPrix !== undefined) {
      query = query.where('races.grandPrix', '=', grandPrix)
    }

    if (team !== undefined) {
      query = query.where('teams.name', 'ilike', `%${team}%`)
    }

    return await query.execute()
  }

  async getByID (id: number) {
    return await this.db
      .selectFrom('races')
      .innerJoin('drivers', 'drivers.id', 'races.winnerId')
      .innerJoin('teams', 'teams.id', 'races.teamId')
      .select(() => [
        'races.id',
        'races.grandPrix',
        'races.raceDate',
        sql<string>`concat(first_name, ' ', last_name)`.as('winner'),
        'teams.name as teamName'
      ])
      .distinctOn('races.id')
      .where('races.id', '=', id)
      .execute()
  }
}
