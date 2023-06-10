import { Pool } from 'pg'
import {
  Kysely,
  PostgresDialect,
  Generated,
  CamelCasePlugin
} from 'kysely'

// const pool = new Pool({
//   connectionString: 'postgres://root:postgres@localhost:5432/vrillar'
// })

export interface Team {
  id: Generated<number>
  name: string
}

export interface TeamPoint {
  id: Generated<number>
  teamId: number
  position: string
  points: number
  year: number
}

export interface Driver {
  id: Generated<number>
  firstName: string
  lastName: string
  nationality: string
}

export interface DriverTeam {
  id: Generated<number>
  driverId: number
  teamId: number
  position: string
  points: number
  year: number
}

export interface Race {
  id: Generated<number>
  grandPrix: string
  raceDate: Date
  winnerId: number
  teamId: number
  laps: number | null
  raceTime: string
  year: number
}

export interface Database {
  teams: Team
  teamPoints: TeamPoint
  drivers: Driver
  driverTeams: DriverTeam
  races: Race
}

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: 'localhost',
      database: 'vrillar',
      user: 'root',
      password: 'postgres',
      port: 5432
    })
  }),
  plugins: [new CamelCasePlugin()]
})

export default db
