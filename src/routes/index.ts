import { Router } from 'express'
import { DriverController } from '../controllers/driver.controller'
import db from '../db/connection'
import { DriverService } from '../services/driver.service'

const driverService = new DriverService(db)
const driverController = new DriverController(driverService)

const router = Router()

router.get('/drivers', driverController.getAllDrivers)
router.get('/drivers/:id', driverController.getDriverByID)

export default router
