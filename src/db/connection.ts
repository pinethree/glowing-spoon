import dotenv from 'dotenv'

import { Pool } from 'pg'
import {
  Kysely,
  PostgresDialect,
  Generated,
  CamelCasePlugin
} from 'kysely'
dotenv.config()

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
      host: process.env.DB_HOST,
      database: process.env.DB_NAME || 'vrillar',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'postgres',
      port: Number(process.env.DB_HOST)
    })
  }),
  plugins: [new CamelCasePlugin()]
})

export default db
