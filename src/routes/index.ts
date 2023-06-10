import { Router } from 'express'
import db from '../db/connection'
import { DriverController } from '../controllers/driver.controller'
import { TeamController } from '../controllers/team.controller'
import { RaceController } from '../controllers/race.controller'
import { DriverService } from '../services/driver.service'
import { TeamService } from '../services/team.service'
import { RaceService } from '../services/race.service'

const driverService = new DriverService(db)
const driverController = new DriverController(driverService)
const teamService = new TeamService(db)
const teamController = new TeamController(teamService)
const raceService = new RaceService(db)
const raceController = new RaceController(raceService)

const router = Router()

router.get('/drivers', driverController.getListDrivers)
router.get('/drivers/:id', driverController.getDriverByID)
router.get('/drivers/:id/rankings', driverController.getRanking)
router.get('/teams', teamController.getListTeams)
router.get('/teams/:id', teamController.getTeamById)
router.get('/teams/:id/rankings', teamController.getRanking)
router.get('/races', raceController.getListRaces)
router.get('/races/:id', raceController.getRaceById)

export default router
