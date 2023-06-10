import { Router } from 'express'
import db from '../db/connection'
import { DriverController } from '../controllers/driver.controller'
import { TeamController } from '../controllers/team.controller'
import { DriverService } from '../services/driver.service'
import { TeamService } from '../services/team.service'

const driverService = new DriverService(db)
const driverController = new DriverController(driverService)
const teamService = new TeamService(db)
const teamController = new TeamController(teamService)

const router = Router()

router.get('/drivers', driverController.getListDrivers)
router.get('/drivers/:id', driverController.getDriverByID)
router.get('/teams', teamController.getListTeams)
router.get('/teams/:id', teamController.getTeamById)

export default router
