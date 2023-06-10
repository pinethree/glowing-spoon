import { Request, Response } from 'express'
import { RaceService } from '../services/race.service'
import { GetRaceOptions } from '../types'

export class RaceController {
  private readonly raceService: RaceService

  constructor (raceService: RaceService) {
    this.raceService = raceService
  }

  getListRaces = async (req: Request, res: Response) => {
    try {
      const { page, limit, grandPrix, team, year } = req.query
      const opts: GetRaceOptions = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        grandPrix: grandPrix as string,
        team: team as string,
        year: Number(year) || 2023 // <-- should be dynamic here
      }

      const races = await this.raceService.getList(opts)
      res.json(races)
    } catch (error) {
      // Handle the error and send an appropriate response
    }
  }

  getRaceById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id)
      const race = await this.raceService.getByID(id)
      res.json(race)
    } catch (error) {
      // Handle the error
      res.status(400).json({ message: 'Bad Request' })
    }
  }
}
