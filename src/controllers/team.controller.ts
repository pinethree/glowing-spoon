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
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        name: name as string,
        year: Number(year) || 2023 // <-- should be dynamic here
      }

      const teams = await this.teamService.getList(opts)
      res.json(teams)
    } catch (error) {
      // Handle the error and send an appropriate response
    }
  }

  getTeamById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const team = await this.teamService.getByID(id)
      res.json(team)
    } catch (error) {
      // Handle the error
      res.status(400).json({ message: 'Bad Request' })
    }
  }

  getRanking = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const rankings = await this.teamService.getRankingByTeamID(id)
      res.json(rankings)
    } catch (error) {
      // Handle the error
      console.log(error)
      res.status(400).json({ message: 'Bad Request' })
    }
  }
}
