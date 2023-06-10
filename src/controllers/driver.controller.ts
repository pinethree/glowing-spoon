import { Request, Response } from 'express'
import { DriverService } from '../services/driver.service'
import { GetDriversOptions } from '../types'

export class DriverController {
  private readonly driverService: DriverService

  constructor (driverService: DriverService) {
    this.driverService = driverService
  }

  getAllDrivers = async (req: Request, res: Response) => {
    try {
      const { page, limit, firstName, lastName, nationality } = req.query
      const opts: GetDriversOptions = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        firstName: firstName as string,
        lastName: lastName as string,
        nationality: nationality as string
      }

      const drivers = await this.driverService.getList(opts)
      res.json(drivers)
    } catch (error) {
      // Handle the error and send an appropriate response
    }
  }

  getDriverByID = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id)
      const driver = await this.driverService.getByID(id)
      res.json(driver)
    } catch (error) {
      // Handle the error
      res.status(400).json({ message: 'Bad Request' })
    }
  }
}
