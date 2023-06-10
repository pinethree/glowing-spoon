import { Request, Response } from 'express'
import { DriverService } from '../services/driver.service'
import { GetDriversOptions } from '../types'

export class DriverController {
  private readonly driverService: DriverService

  constructor (driverService: DriverService) {
    this.driverService = driverService
  }

  getListDrivers = async (req: Request, res: Response) => {
    try {
      const { page, limit, firstName, lastName, nationality, year } = req.query
      const opts: GetDriversOptions = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        firstName: firstName as string,
        lastName: lastName as string,
        nationality: nationality as string,
        year: Number(year) || 2023 // <-- should be dynamic here
      }

      const drivers = await this.driverService.getList(opts)
      res.json(drivers)
    } catch (error) {
      // Handle the error and send an appropriate response
    }
  }

  getDriverByID = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const driver = await this.driverService.getByID(id)
      res.json(driver)
    } catch (error) {
      // Handle the error
      res.status(400).json({ message: 'Bad Request' })
    }
  }

  getRanking = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const rankings = await this.driverService.getRankingByDriverID(id)
      res.json(rankings)
    } catch (error) {
      // Handle the error
      console.log(error)
      res.status(400).json({ message: 'Bad Request' })
    }
  }
}
