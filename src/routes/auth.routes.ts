import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()

router.post('/login', UserController.login)

router.get('/logout', UserController.logout)

router.post('/register', UserController.register)

router.delete('/remove', UserController.remove)

export default router
