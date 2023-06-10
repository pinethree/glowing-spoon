import { Request, Response } from 'express'
import { TeamService } from '../services/team.service'
import { GetTeamsOptions } from '../types'

export class TeamController {
  private readonly teamService: TeamService

  constructor (teamService: TeamService) {
    this.teamService = teamService
  }

  getListTeams = async (req: Request, res: Response) => {
    try {
      const { page, limit, name, year } = req.query
      const opts: GetTeamsOptions = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        name: name as string,
        year: parseInt(year as string) || 2023 // <-- should be dynamic here
      }

      const teams = await this.teamService.getList(opts)
      res.json(teams)
    } catch (error) {
      // Handle the error and send an appropriate response
    }
  }

  getTeamById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id)
      const team = await this.teamService.getByID(id)
      res.json(team)
    } catch (error) {
      // Handle the error
      res.status(400).json({ message: 'Bad Request' })
    }
  }
}
