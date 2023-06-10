
import { Kysely } from 'kysely'
import { Database, Driver } from '../db/connection'
import { GetDriversOptions } from '../types'

export class DriverService {
  private readonly db: Kysely<Database>

  constructor (db: Kysely<Database>) {
    this.db = db
  }

  async getList ({ page, limit, firstName, lastName, nationality }: GetDriversOptions) {
    const offset = (page - 1) * limit
    let query = this.db.selectFrom('drivers').selectAll().limit(limit).offset(offset)

    if (firstName) {
      query = query.where('firstName', '=', firstName)
    }

    if (lastName) {
      query = query.where('lastName', '=', lastName)
    }

    if (nationality) {
      query = query.where('nationality', '=', nationality)
    }

    return await query.execute()
  }

  async getByID (id: number) {
    return await this.db.selectFrom('drivers').selectAll().where('id', '=', id).execute()
  }
}
